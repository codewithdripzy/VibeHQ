import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import { AppError } from "../core/middleware/error.middleware";

interface PaginationOptions {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    search?: string;
    searchFields?: string[];
}

interface PaginatedResult<T> {
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

export function createCrudService<T extends Document>(model: Model<any>) {
    return {
        async findAll(
            filter: FilterQuery<T> = {},
            options: PaginationOptions = {}
        ): Promise<PaginatedResult<T>> {
            const { page = 1, limit = 20, sort = "createdAt", order = "desc", search, searchFields = [] } = options;
            const query: FilterQuery<T> = { ...filter, deletedAt: null };
            if (search && searchFields.length > 0) {
                query.$or = searchFields.map(field => ({ [field]: { $regex: search, $options: "i" } }) as any);
            }
            const total = await model.countDocuments(query);
            const data = await model
                .find(query)
                .sort({ [sort]: order === "asc" ? 1 : -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();
            return {
                data: data as T[],
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page * limit < total,
                    hasPrev: page > 1,
                },
            };
        },

        async findById(id: string): Promise<T> {
            const doc = await model.findOne({ _id: id, deletedAt: null } as FilterQuery<T>);
            if (!doc) throw new AppError("Not found", 404);
            return doc;
        },

        async create(data: Partial<T>): Promise<T> {
            const doc = await model.create(data);
            return doc;
        },

        async update(id: string, data: UpdateQuery<T>): Promise<T> {
            const doc = await model.findOneAndUpdate(
                { _id: id, deletedAt: null } as FilterQuery<T>,
                data,
                { new: true, runValidators: true }
            );
            if (!doc) throw new AppError("Not found", 404);
            return doc;
        },

        async softDelete(id: string): Promise<void> {
            const doc = await model.findByIdAndUpdate(
                id,
                { deletedAt: new Date() } as UpdateQuery<T>,
                { new: true }
            );
            if (!doc) throw new AppError("Not found", 404);
        },

        async hardDelete(id: string): Promise<void> {
            const doc = await model.findByIdAndDelete(id);
            if (!doc) throw new AppError("Not found", 404);
        },

        async count(filter: FilterQuery<T> = {}): Promise<number> {
            return model.countDocuments({ ...filter, deletedAt: null });
        },

        async exists(filter: FilterQuery<T>): Promise<boolean> {
            const doc = await model.exists({ ...filter, deletedAt: null } as FilterQuery<T>);
            return !!doc;
        },
    };
}
