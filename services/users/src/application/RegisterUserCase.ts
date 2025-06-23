import { UserRepository } from '../ports/UserRepository';

export class RegisterUserUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(data: { id: string; name: string }): Promise<void> {
    await this.userRepo.save(data);
    console.log('Usuario registrado:', data);
  }
}
