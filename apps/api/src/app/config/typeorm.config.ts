import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Channel } from '../entities/channel.entity';
import { Message } from '../entities/message.entity';
import { UserChannel } from '../entities/user-channel.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'chat.db',
  entities: [User, Channel, Message, UserChannel],
  synchronize: true,
  logging: true
}; 