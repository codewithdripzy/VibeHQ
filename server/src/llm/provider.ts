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

export type ProviderType = "ollama" | "huggingface" | "groq" | "openai" | "anthropic" | "google";

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
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}
