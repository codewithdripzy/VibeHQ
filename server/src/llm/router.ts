import {
  BaseLLMProvider,
  LLMMessage,
  LLMResponse,
  LLMProviderConfig,
  ProviderType,
  createProvider,
  OllamaProvider,
  GroqProvider,
  HuggingFaceProvider,
  GoogleProvider,
  OpenAIProvider,
  AnthropicProvider,
} from "./provider";
import LLMConfigModel from "../schemas/llmConfig.schema";

export interface LLMConfig {
  defaultProvider: ProviderType;
  fallbackOrder: ProviderType[];
  providers: Partial<Record<ProviderType, Partial<LLMProviderConfig>>>;
  timeout?: number;
  maxRetries?: number;
}

export interface CompanyLLMConfig {
  companyId: string;
  llmConfig: LLMConfig;
}

const DEFAULT_FALLBACK_ORDER: ProviderType[] = [
  "nvidia",
  "ollama",
  "groq",
  "huggingface",
  "google",
  "openai",
  "anthropic",
  "fallback",
];

const DEFAULT_CONFIG: LLMConfig = {
  defaultProvider: "nvidia",
  fallbackOrder: DEFAULT_FALLBACK_ORDER,
  providers: {},
  timeout: 60000,
  maxRetries: 2,
};

export class LLMRouter {
  private providers: Map<ProviderType, BaseLLMProvider> = new Map();
  private config: LLMConfig;

  constructor(config?: Partial<LLMConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initializeProviders();
  }

  private initializeProviders(): void {
    const providerTypes: ProviderType[] = ["nvidia", "ollama", "huggingface", "groq", "openai", "anthropic", "google", "fallback"];

    for (const type of providerTypes) {
      const providerConfig = this.config.providers[type];
      const provider = createProvider(type, providerConfig);
      this.providers.set(type, provider);
    }
  }

  async chat(
    messages: LLMMessage[],
    companyId: string,
    preferredProvider?: ProviderType
  ): Promise<LLMResponse> {
    const companyConfig = await this.loadCompanyConfig(companyId);
    const config = companyConfig || this.config;
    const maxRetries = config.maxRetries ?? 2;

    const fallbackOrder = preferredProvider
      ? [preferredProvider, ...config.fallbackOrder.filter(p => p !== preferredProvider)]
      : config.fallbackOrder;

    let lastError: Error | null = null;

    for (const providerType of fallbackOrder) {
      const provider = this.providers.get(providerType);
      if (!provider) {
        continue;
      }

      try {
        const isAvailable = await provider.isAvailable();
        if (!isAvailable) {
          continue;
        }
      } catch {
        continue;
      }

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const providerConfig = config.providers[providerType] || this.config.providers[providerType];
          const response = await provider.chat(messages, {
            temperature: providerConfig?.temperature,
            maxTokens: providerConfig?.maxTokens,
          } as any);

          return response;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          const isLastAttempt = attempt === maxRetries;
          console.error(
            `Provider ${providerType} failed (attempt ${attempt + 1}/${maxRetries + 1}) for company ${companyId}:`,
            lastError.message
          );

          if (!isLastAttempt) {
            const backoff = Math.pow(2, attempt) * 500;
            console.log(`Retrying ${providerType} in ${backoff}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoff));
          }
        }
      }
    }

    throw new Error(
      `All providers failed for company ${companyId}. Last error: ${lastError?.message || "No providers available"}`
    );
  }

  private async loadCompanyConfig(companyId: string): Promise<LLMConfig | null> {
    try {
      const configs = await LLMConfigModel.find({ company: companyId, isActive: true });
      if (!configs || configs.length === 0) {
        return null;
      }

      const providers: Partial<Record<ProviderType, Partial<LLMProviderConfig>>> = {};
      let defaultProvider: ProviderType = "ollama";

      for (const config of configs) {
        const providerType = config.provider as ProviderType;
        providers[providerType] = {
          baseUrl: config.config?.baseUrl ?? undefined,
          model: config.model,
          temperature: config.config?.temperature,
          maxTokens: config.config?.maxTokens,
        };
        if (config.isDefault) {
          defaultProvider = providerType;
        }
      }

      const sortedConfigs = configs.sort((a, b) => (a.fallbackOrder || 0) - (b.fallbackOrder || 0));
      const fallbackOrder = sortedConfigs.map(c => c.provider as ProviderType);

      return { defaultProvider, fallbackOrder, providers };
    } catch (error) {
      console.error(`Failed to load LLM config for company ${companyId}:`, error);
      return null;
    }
  }

  async getAvailableProviders(companyId?: string): Promise<ProviderType[]> {
    const available: ProviderType[] = [];

    for (const [type, provider] of this.providers) {
      try {
        const isAvailable = await provider.isAvailable();
        if (isAvailable) {
          available.push(type);
        }
      } catch {
        continue;
      }
    }

    return available;
  }

  async getModels(providerType: ProviderType): Promise<string[]> {
    const provider = this.providers.get(providerType);
    if (!provider) {
      return [];
    }

    try {
      return await provider.getModels();
    } catch {
      return [];
    }
  }

  getProvider(type: ProviderType): BaseLLMProvider | undefined {
    return this.providers.get(type);
  }

  updateConfig(config: Partial<LLMConfig>): void {
    this.config = { ...this.config, ...config };

    if (config.providers) {
      for (const [type, providerConfig] of Object.entries(config.providers)) {
        if (providerConfig) {
          const provider = createProvider(type as ProviderType, providerConfig);
          this.providers.set(type as ProviderType, provider);
        }
      }
    }
  }
}

let globalRouter: LLMRouter | null = null;

export function getLLMRouter(config?: Partial<LLMConfig>): LLMRouter {
  if (!globalRouter) {
    globalRouter = new LLMRouter(config);
  }
  return globalRouter;
}

export async function chat(
  messages: LLMMessage[],
  companyId: string,
  preferredProvider?: ProviderType
): Promise<LLMResponse> {
  const router = getLLMRouter();
  return router.chat(messages, companyId, preferredProvider);
}
