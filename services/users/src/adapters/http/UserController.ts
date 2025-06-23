import { Router, Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/RegisterUserUseCase';
import { MySQLUserRepository } from '../repository/MySQLUserRepository';

const router = Router();
const userRepo = new MySQLUserRepository();
const registerUseCase = new RegisterUserUseCase(userRepo);

router.post('/users', async (req: Request, res: Response) => {
  const { id, name } = req.body;
  await registerUseCase.execute({ id, name });
  res.status(201).json({ id, name });
});

export default router;
