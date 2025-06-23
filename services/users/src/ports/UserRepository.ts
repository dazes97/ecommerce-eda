export interface UserRepository {
  save(user: { id: string; name: string }): Promise<void>;
  findById(id: string): Promise<{ id: string; name: string } | null>;
}
