import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { Channel } from './entities/channel.entity';
import { Message } from './entities/message.entity';
import { ChannelController } from './controllers/channel.controller';
import { MessageController } from './controllers/message.controller';
import { ChannelService } from './services/channel.service';
import { MessageService } from './services/message.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([User, Channel, Message]),
    AuthModule
  ],
  controllers: [ChannelController, MessageController],
  providers: [ChannelService, MessageService]
})
export class AppModule {}
