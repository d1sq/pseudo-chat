import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Channel } from '../entities/channel.entity';
import { Message } from '../entities/message.entity';
import { join } from 'path';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'chat.db',
  entities: [User, Channel, Message],
  synchronize: true, // В продакшене должно быть false
  logging: true
}; 