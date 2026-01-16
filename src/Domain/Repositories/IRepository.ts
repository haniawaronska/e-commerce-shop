export interface IRepository<T> {
    getById(id: string): Promise<T | null>;
    save(entity: T): Promise<void>;
    delete(id: string): Promise<void>;
    getAll(): Promise<T[]>;
}

