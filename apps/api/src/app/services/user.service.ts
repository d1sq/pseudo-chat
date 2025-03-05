import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findById(id: string | number): Promise<User | null> {
    const userId = typeof id === 'number' ? id.toString() : id;
    console.log(`Поиск пользователя по ID: ${userId}, тип: ${typeof userId}`);
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async getAllUsers(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find();
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async updateUserOnlineStatus(id: string, isOnline: boolean): Promise<Partial<User>> {
    await this.userRepository.update(id, { is_online: isOnline });
    const user = await this.findById(id);
    if (!user) return null;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
} 