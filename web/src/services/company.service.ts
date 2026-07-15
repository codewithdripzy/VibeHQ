import ApiService from "./api.service";

export interface Company {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    industry?: string;
    status: "draft" | "active" | "paused" | "archived";
    owner: string;
    createdAt: string;
    metadata?: {
        employeeCount?: number;
        activeProjectCount?: number;
        totalRevenue?: number;
    };
}

interface CompaniesResponse {
    message: string;
    data: Company[];
}

interface CompanyResponse {
    message: string;
    data: Company;
}

class CompanyService extends ApiService {
    private static instance: CompanyService;

    private constructor() {
        super();
    }

    static getInstance() {
        if (!CompanyService.instance) {
            CompanyService.instance = new CompanyService();
        }
        return CompanyService.instance;
    }

    async getCompanies() {
        const { data } = await this.get<CompaniesResponse>("/api/companies");
        return data;
    }

    async getCompany(id: string) {
        const { data } = await this.get<CompanyResponse>(`/api/companies/${id}`);
        return data;
    }

    async createCompany(payload: { name: string; description?: string; industry?: string }) {
        const { data } = await this.post<CompanyResponse>("/api/companies", payload);
        return data;
    }
}

const companyService = CompanyService.getInstance();
export default companyService;
