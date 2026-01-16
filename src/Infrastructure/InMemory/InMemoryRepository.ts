import { IRepository } from "../../Domain/Repositories/IRepository";

interface HasID {
    ID: string;
}

export class InMemoryRepository<T extends HasID> implements IRepository<T> {
    private db: Map<string, T> = new Map<string, T>();

    public getById(id: string): T | null {
        return this.db.get(id) || null;
    }

    public save(entity: T): void {
        this.db.set(entity.ID, entity);
    }

    public delete(id: string): void {
        this.db.delete(id);
    }

    public getAll(): T[] {
        return Array.from(this.db.values());
    }
}