import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { Channel } from './entities/channel.entity';
import { Message } from './entities/message.entity';
import { UserChannel } from './entities/user-channel.entity';
import { ChannelController } from './controllers/channel.controller';
import { MessageController } from './controllers/message.controller';
import { ChannelService } from './services/channel.service';
import { MessageService } from './services/message.service';
import { UserService } from './services/user.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([User, Channel, Message, UserChannel]),
    AuthModule
  ],
  controllers: [ChannelController, MessageController],
  providers: [
    ChannelService, 
    MessageService, 
    UserService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    }
  ],
  exports: [UserService]
})
export class AppModule {}
