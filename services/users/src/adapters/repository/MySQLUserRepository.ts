import { Sequelize, Model, DataTypes } from 'sequelize';
import { UserRepository } from '../../ports/UserRepository';
import sequelize from '../../../infrastructure/database/mysql';

class UserModel extends Model {
  public id!: string;
  public name!: string;
}
UserModel.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true },
    name: DataTypes.STRING
  },
  { sequelize, tableName: 'users' }
);

export class MySQLUserRepository implements UserRepository {
  async save(user: { id: string; name: string }): Promise<void> {
    await UserModel.create(user);
    console.log('User guardado en MySQL:', user);
  }
  async findById(id: string): Promise<{ id: string; name: string } | null> {
    const record = await UserModel.findByPk(id);
    return record ? { id: record.id, name: record.name } : null;
  }
}
