import ApiService from "./api.service";

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class EntityService extends ApiService {
  private static instance: EntityService;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!EntityService.instance) {
      EntityService.instance = new EntityService();
    }
    return EntityService.instance;
  }

  async list<T>(endpoint: string, params?: Record<string, string | number>) {
    const query = params
      ? "?" + new URLSearchParams(params as Record<string, string>).toString()
      : "";
    const { data } = await this.get<PaginatedResponse<T>>(`/api/${endpoint}${query}`);
    return data;
  }

  async findOne<T>(endpoint: string) {
    const { data } = await this.get<{ data: T }>(`/api/${endpoint}`);
    return data;
  }

  async create<T>(endpoint: string, body: Record<string, unknown>) {
    const { data } = await this.post<{ data: T }>(`/api/${endpoint}`, body);
    return data;
  }

  async update<T>(endpoint: string, id: string, body: Record<string, unknown>, suffix?: string) {
    const { data } = await this.put<{ data: T }>(`/api/${endpoint}/${id}${suffix || ""}`, body);
    return data;
  }

  async patchById<T>(endpoint: string, id: string, body: Record<string, unknown>, suffix?: string) {
    const { data } = await this.patch<{ data: T }>(`/api/${endpoint}/${id}${suffix || ""}`, body);
    return data;
  }
}

const entityService = EntityService.getInstance();
export default entityService;
