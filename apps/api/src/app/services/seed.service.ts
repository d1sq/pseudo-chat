import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Channel } from '../entities/channel.entity';
import { Message } from '../entities/message.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>
  ) {}

  async seed() {
    // Создаем пользователей
    const admin = this.userRepository.create({
      username: 'admin',
      password: await bcrypt.hash('admin', 10),
      isOnline: true
    });
    await this.userRepository.save(admin);

    const user1 = this.userRepository.create({
      username: 'user1',
      password: await bcrypt.hash('user1', 10),
      isOnline: true
    });
    await this.userRepository.save(user1);

    const user2 = this.userRepository.create({
      username: 'user2',
      password: await bcrypt.hash('user2', 10),
      isOnline: false
    });
    await this.userRepository.save(user2);

    // Создаем каналы
    const general = this.channelRepository.create({
      name: 'general',
      description: 'Общий канал для всех'
    });
    await this.channelRepository.save(general);

    const random = this.channelRepository.create({
      name: 'random',
      description: 'Канал для случайных обсуждений'
    });
    await this.channelRepository.save(random);

    // Создаем тестовые сообщения
    const message1 = this.messageRepository.create({
      content: 'Привет всем в общем канале!',
      user: admin,
      channel: general
    });
    await this.messageRepository.save(message1);

    const message2 = this.messageRepository.create({
      content: 'Привет! Как дела?',
      user: user1,
      channel: general
    });
    await this.messageRepository.save(message2);

    const message3 = this.messageRepository.create({
      content: 'Всем привет в случайном канале!',
      user: user2,
      channel: random
    });
    await this.messageRepository.save(message3);

    console.log('База данных успешно заполнена тестовыми данными');
  }
} 