export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMResponse {
  content: string;
  model: string;
  provider: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latency: number;
}

export interface LLMProviderConfig {
  baseUrl: string;
  apiKey?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  timeout?: number;
}

export abstract class BaseLLMProvider {
  protected config: LLMProviderConfig;

  constructor(config: LLMProviderConfig) {
    this.config = config;
  }

  abstract chat(messages: LLMMessage[], options?: {
    temperature?: number;
    maxTokens?: number;
  }): Promise<LLMResponse>;

  abstract isAvailable(): Promise<boolean>;

  abstract getModels(): Promise<string[]>;

  protected calculateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  protected async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number = 30000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export class OllamaProvider extends BaseLLMProvider {
  constructor(config?: Partial<LLMProviderConfig>) {
    super({
      baseUrl: config?.baseUrl || "http://localhost:11434",
      model: config?.model || "llama3.2",
      temperature: config?.temperature ?? 0.7,
      maxTokens: config?.maxTokens ?? 2048,
      timeout: config?.timeout ?? 60000,
    });
  }

  async chat(messages: LLMMessage[], options?: {
    temperature?: number;
    maxTokens?: number;
  }): Promise<LLMResponse> {
    const startTime = Date.now();

    const response = await this.fetchWithTimeout(
      `${this.config.baseUrl}/api/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          options: {
            temperature: options?.temperature ?? this.config.temperature,
            num_predict: options?.maxTokens ?? this.config.maxTokens,
          },
        }),
      },
      this.config.timeout
    );

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    const latency = Date.now() - startTime;

    return {
      content: data.message?.content || "",
      model: this.config.model,
      provider: "ollama",
      usage: {
        promptTokens: data.prompt_eval_count || this.calculateTokens(messages.map(m => m.content).join(" ")),
        completionTokens: data.eval_count || this.calculateTokens(data.message?.content || ""),
        totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
      },
      latency,
    };
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(
        `${this.config.baseUrl}/api/tags`,
        { method: "GET" },
        5000
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  async getModels(): Promise<string[]> {
    try {
      const response = await this.fetchWithTimeout(
        `${this.config.baseUrl}/api/tags`,
        { method: "GET" },
        5000
      );
      if (!response.ok) return [];
      const data = await response.json();
      return data.models?.map((m: { name: string }) => m.name) || [];
    } catch {
      return [];
    }
  }
}

export class HuggingFaceProvider extends BaseLLMProvider {
  constructor(config?: Partial<LLMProviderConfig>) {
    super({
      baseUrl: config?.baseUrl || "https://api-inference.huggingface.co",
      apiKey: config?.apiKey || process.env.HUGGINGFACE_API_KEY,
      model: config?.model || "meta-llama/Llama-3-8B-Instruct",
      temperature: config?.temperature ?? 0.7,
      maxTokens: config?.maxTokens ?? 1024,
      timeout: config?.timeout ?? 30000,
    });
  }

  async chat(messages: LLMMessage[], options?: {
    temperature?: number;
    maxTokens?: number;
  }): Promise<LLMResponse> {
    const startTime = Date.now();

    const response = await this.fetchWithTimeout(
      `${this.config.baseUrl}/models/${this.config.model}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          inputs: this.formatMessages(messages),
          parameters: {
            temperature: options?.temperature ?? this.config.temperature,
            max_new_tokens: options?.maxTokens ?? this.config.maxTokens,
            top_p: this.config.topP,
          },
        }),
      },
      this.config.timeout
    );

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.status}`);
    }

    const data = await response.json();
    const latency = Date.now() - startTime;
    const content = Array.isArray(data) ? data[0]?.generated_text : data.generated_text || "";

    return {
      content,
      model: this.config.model,
      provider: "huggingface",
      usage: {
        promptTokens: this.calculateTokens(messages.map(m => m.content).join(" ")),
        completionTokens: this.calculateTokens(content),
        totalTokens: this.calculateTokens(messages.map(m => m.content).join(" ")) + this.calculateTokens(content),
      },
      latency,
    };
  }

  private formatMessages(messages: LLMMessage[]): string {
    return messages.map(m => `<|${m.role}|>\n${m.content}`).join("\n") + "\n<|assistant|>\n";
  }

  async isAvailable(): Promise<boolean> {
    return !!this.config.apiKey;
  }

  async getModels(): Promise<string[]> {
    return [
      "meta-llama/Llama-3-8B-Instruct",
      "meta-llama/Llama-3-70B-Instruct",
      "mistralai/Mistral-7B-Instruct-v0.2",
      "HuggingFaceH4/zephyr-7b-beta",
    ];
  }
}

export class GroqProvider extends BaseLLMProvider {
  constructor(config?: Partial<LLMProviderConfig>) {
    super({
      baseUrl: config?.baseUrl || "https://api.groq.com/openai/v1",
      apiKey: config?.apiKey || process.env.GROQ_API_KEY,
      model: config?.model || "llama3-8b-8192",
      temperature: config?.temperature ?? 0.7,
      maxTokens: config?.maxTokens ?? 1024,
      timeout: config?.timeout ?? 30000,
    });
  }

  async chat(messages: LLMMessage[], options?: {
    temperature?: number;
    maxTokens?: number;
  }): Promise<LLMResponse> {
    const startTime = Date.now();

    const response = await this.fetchWithTimeout(
      `${this.config.baseUrl}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          temperature: options?.temperature ?? this.config.temperature,
          max_tokens: options?.maxTokens ?? this.config.maxTokens,
          top_p: this.config.topP,
          frequency_penalty: this.config.frequencyPenalty,
          presence_penalty: this.config.presencePenalty,
          stop: this.config.stopSequences,
        }),
      },
      this.config.timeout
    );

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const latency = Date.now() - startTime;

    return {
      content: data.choices?.[0]?.message?.content || "",
      model: this.config.model,
      provider: "groq",
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
      latency,
    };
  }

  async isAvailable(): Promise<boolean> {
    return !!this.config.apiKey;
  }

  async getModels(): Promise<string[]> {
    return [
      "llama3-8b-8192",
      "llama3-70b-8192",
      "mixtral-8x7b-32768",
      "gemma-7b-it",
    ];
  }
}

export class OpenAIProvider extends BaseLLMProvider {
  constructor(config?: Partial<LLMProviderConfig>) {
    super({
      baseUrl: config?.baseUrl || "https://api.openai.com/v1",
      apiKey: config?.apiKey || process.env.OPENAI_API_KEY,
      model: config?.model || "gpt-4o",
      temperature: config?.temperature ?? 0.7,
      maxTokens: config?.maxTokens ?? 1024,
      timeout: config?.timeout ?? 30000,
    });
  }

  async chat(messages: LLMMessage[], options?: {
    temperature?: number;
    maxTokens?: number;
  }): Promise<LLMResponse> {
    const startTime = Date.now();

    const response = await this.fetchWithTimeout(
      `${this.config.baseUrl}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          temperature: options?.temperature ?? this.config.temperature,
          max_tokens: options?.maxTokens ?? this.config.maxTokens,
          top_p: this.config.topP,
          frequency_penalty: this.config.frequencyPenalty,
          presence_penalty: this.config.presencePenalty,
          stop: this.config.stopSequences,
        }),
      },
      this.config.timeout
    );

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const latency = Date.now() - startTime;

    return {
      content: data.choices?.[0]?.message?.content || "",
      model: this.config.model,
      provider: "openai",
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
      latency,
    };
  }

  async isAvailable(): Promise<boolean> {
    return !!this.config.apiKey;
  }

  async getModels(): Promise<string[]> {
    return [
      "gpt-4o",
      "gpt-4o-mini",
      "gpt-4-turbo",
      "gpt-3.5-turbo",
    ];
  }
}

export class AnthropicProvider extends BaseLLMProvider {
  constructor(config?: Partial<LLMProviderConfig>) {
    super({
      baseUrl: config?.baseUrl || "https://api.anthropic.com/v1",
      apiKey: config?.apiKey || process.env.ANTHROPIC_API_KEY,
      model: config?.model || "claude-sonnet-4-20250514",
      temperature: config?.temperature ?? 0.7,
      maxTokens: config?.maxTokens ?? 1024,
      timeout: config?.timeout ?? 30000,
    });
  }

  async chat(messages: LLMMessage[], options?: {
    temperature?: number;
    maxTokens?: number;
  }): Promise<LLMResponse> {
    const startTime = Date.now();
    const systemMessage = messages.find(m => m.role === "system");
    const chatMessages = messages.filter(m => m.role !== "system");

    const response = await this.fetchWithTimeout(
      `${this.config.baseUrl}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.config.apiKey!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: chatMessages,
          system: systemMessage?.content,
          temperature: options?.temperature ?? this.config.temperature,
          max_tokens: options?.maxTokens ?? this.config.maxTokens,
          top_p: this.config.topP,
          stop_sequences: this.config.stopSequences,
        }),
      },
      this.config.timeout
    );

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const latency = Date.now() - startTime;

    return {
      content: data.content?.[0]?.text || "",
      model: this.config.model,
      provider: "anthropic",
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
      latency,
    };
  }

  async isAvailable(): Promise<boolean> {
    return !!this.config.apiKey;
  }

  async getModels(): Promise<string[]> {
    return [
      "claude-sonnet-4-20250514",
      "claude-3-5-haiku-20241022",
      "claude-3-opus-20240229",
    ];
  }
}

export class GoogleProvider extends BaseLLMProvider {
  constructor(config?: Partial<LLMProviderConfig>) {
    super({
      baseUrl: config?.baseUrl || "https://generativelanguage.googleapis.com/v1beta",
      apiKey: config?.apiKey || process.env.GOOGLE_API_KEY,
      model: config?.model || "gemini-1.5-flash",
      temperature: config?.temperature ?? 0.7,
      maxTokens: config?.maxTokens ?? 1024,
      timeout: config?.timeout ?? 30000,
    });
  }

  async chat(messages: LLMMessage[], options?: {
    temperature?: number;
    maxTokens?: number;
  }): Promise<LLMResponse> {
    const startTime = Date.now();

    const contents = messages
      .filter(m => m.role !== "system")
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const systemMessage = messages.find(m => m.role === "system");

    const response = await this.fetchWithTimeout(
      `${this.config.baseUrl}/models/${this.config.model}:generateContent?key=${this.config.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: systemMessage ? { parts: [{ text: systemMessage.content }] } : undefined,
          generationConfig: {
            temperature: options?.temperature ?? this.config.temperature,
            maxOutputTokens: options?.maxTokens ?? this.config.maxTokens,
            topP: this.config.topP,
          },
        }),
      },
      this.config.timeout
    );

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }

    const data = await response.json();
    const latency = Date.now() - startTime;
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const usageMetadata = data.usageMetadata || {};

    return {
      content,
      model: this.config.model,
      provider: "google",
      usage: {
        promptTokens: usageMetadata.promptTokenCount || 0,
        completionTokens: usageMetadata.candidatesTokenCount || 0,
        totalTokens: usageMetadata.totalTokenCount || 0,
      },
      latency,
    };
  }

  async isAvailable(): Promise<boolean> {
    return !!this.config.apiKey;
  }

  async getModels(): Promise<string[]> {
    return [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-2.0-flash",
    ];
  }
}

export class NvidiaProvider extends BaseLLMProvider {
  constructor(config?: Partial<LLMProviderConfig>) {
    super({
      baseUrl: config?.baseUrl || "https://integrate.api.nvidia.com/v1",
      apiKey: config?.apiKey || process.env.NVIDIA_API_KEY,
      model: config?.model || "deepseek-ai/deepseek-v4-flash",
      temperature: config?.temperature ?? 1,
      maxTokens: config?.maxTokens ?? 16384,
      timeout: config?.timeout ?? 60000,
    });
  }

  async chat(messages: LLMMessage[], options?: {
    temperature?: number;
    maxTokens?: number;
  }): Promise<LLMResponse> {
    const startTime = Date.now();

    // Build messages — support multimodal content arrays
    const chatMessages = messages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    const response = await this.fetchWithTimeout(
      `${this.config.baseUrl}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: chatMessages,
          temperature: options?.temperature ?? this.config.temperature,
          max_tokens: options?.maxTokens ?? this.config.maxTokens,
          top_p: this.config.topP ?? 0.95,
          stream: false,
        }),
      },
      this.config.timeout
    );

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      throw new Error(`NVIDIA API error: ${response.status} - ${errBody}`);
    }

    const data = await response.json();
    const latency = Date.now() - startTime;

    return {
      content: data.choices?.[0]?.message?.content || "",
      model: this.config.model,
      provider: "nvidia",
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
      latency,
    };
  }

  async isAvailable(): Promise<boolean> {
    return !!this.config.apiKey;
  }

  async getModels(): Promise<string[]> {
    return [
      "deepseek-ai/deepseek-v4-pro",
      "deepseek-ai/deepseek-v4-flash",
      "google/gemma-4-31b-it",
      "meta/llama-3.3-70b-instruct",
      "meta/llama-3.1-70b-instruct",
      "meta/llama-4-maverick-17b-128e-instruct",
      "qwen/qwq-32b",
      "nvidia/llama-3.3-nemotron-super-49b-v1.5",
      "nvidia/llama-3.1-nemotron-ultra-253b-v1",
    ];
  }
}

export type ProviderType = "ollama" | "huggingface" | "groq" | "openai" | "anthropic" | "google" | "nvidia" | "fallback";

export class FallbackProvider extends BaseLLMProvider {
  constructor(config?: Partial<LLMProviderConfig>) {
    super({
      baseUrl: "",
      model: "fallback-simulated",
      temperature: 0.7,
      maxTokens: 2048,
    });
  }

  async chat(messages: LLMMessage[], options?: {
    temperature?: number;
    maxTokens?: number;
  }): Promise<LLMResponse> {
    const systemMsg = messages.find(m => m.role === "system")?.content || "";
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.content || "";

    const content = this.generateContextualResponse(systemMsg, lastUserMsg);

    return {
      content,
      model: "fallback-simulated",
      provider: "fallback",
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      latency: 0,
    };
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async getModels(): Promise<string[]> {
    return ["fallback-simulated"];
  }

  private generateContextualResponse(system: string, lastMessage: string): string {
    const isDelegation = lastMessage.includes("DELEGATE") || lastMessage.includes("delegate");
    const isSearch = lastMessage.includes("search") || lastMessage.includes("SEARCH");
    const isBrainstormState = lastMessage.includes("Current brainstorm state");
    const isSynthesis = lastMessage.includes("SYNTHESIS") || lastMessage.includes("FINAL_REPORT");

    if (isBrainstormState) {
      if (isDelegation) {
        return JSON.stringify({
          thought: "I need specialized input on this. Let me delegate to the right team.",
          actions: [
            {
              type: "delegate",
              to: "Engineering Team",
              question: "What technical approach should we take and what are the key risks?",
              context: "Board is exploring initial strategy. Need engineering perspective on feasibility.",
              deadline: "24h",
              documentDraft: {
                title: "Technical Feasibility Assessment",
                summary: "Board request for engineering input on proposed direction.",
                generalContext: "Early-stage strategy exploration. Board has identified potential opportunity and needs technical validation.",
                specificRequest: "Assess technical feasibility, recommended approach, and key risks.",
                deliverables: ["Feasibility assessment", "Risk list"],
                evaluationCriteria: "Practical, research-backed recommendations."
              }
            }
          ]
        });
      }

      if (isSearch) {
        return JSON.stringify({
          thought: "Let me gather some market data first.",
          actions: [
            { type: "search", query: "market trends 2025" }
          ]
        });
      }

      if (isSynthesis) {
        return JSON.stringify({
          thought: "I have enough information to compile the final report.",
          actions: [{
            type: "synthesis",
            problemStatement: "Market opportunity identified in the target industry.",
            proposedSolution: "A technology solution addressing key pain points.",
            targetMarket: "Mid-market companies in the target industry.",
            businessModel: "SaaS subscription with tiered pricing.",
            competitiveAdvantage: "First-mover advantage with AI-powered approach.",
            mvpScope: "Core platform with essential features for initial launch.",
            resourceRequirements: "Small engineering team, modest infrastructure costs.",
            riskAssessment: "Moderate risk — market timing and execution are key factors.",
            recommendation: "proceed",
            nextSteps: ["Finalize technical architecture", "Build MVP", "Launch beta"]
          }]
        });
      }

      return JSON.stringify({
        thought: "Let me think through this systematically.",
        actions: [
          {
            type: "answer",
            answer: "Based on initial analysis, this is a promising direction. The market shows strong demand and the competitive landscape allows for differentiation.",
            confidence: 70
          },
          { type: "advance_phase", phase: 2 }
        ]
      });
    }

    return JSON.stringify({
      thought: "Processing the current state of the brainstorm.",
      actions: [
        { type: "answer", answer: "Acknowledged. Continuing with the next step.", confidence: 60 }
      ]
    });
  }
}

export function createProvider(type: ProviderType, config?: Partial<LLMProviderConfig>): BaseLLMProvider {
  switch (type) {
    case "ollama":
      return new OllamaProvider(config);
    case "huggingface":
      return new HuggingFaceProvider(config);
    case "groq":
      return new GroqProvider(config);
    case "openai":
      return new OpenAIProvider(config);
    case "anthropic":
      return new AnthropicProvider(config);
    case "google":
      return new GoogleProvider(config);
    case "nvidia":
      return new NvidiaProvider(config);
    case "fallback":
      return new FallbackProvider(config);
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}
