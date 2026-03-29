import { IRepository } from "../../Domain/Repositories/IRepository";

interface HasID {
    ID: string;
}

export class InMemoryRepository<T extends HasID> implements IRepository<T> {
    private db: Map<string, T> = new Map<string, T>();

    public async getById(id: string): Promise<T | null> {
        return this.db.get(id) || null;
    }

    public async save(entity: T): Promise<void> {
        this.db.set(entity.ID, entity);
    }

    public async delete(id: string): Promise<void> {
        this.db.delete(id);
    }

    public async getAll(): Promise<T[]> {
        return Array.from(this.db.values());
    }
}