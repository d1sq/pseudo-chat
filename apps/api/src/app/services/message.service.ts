import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';
import { Channel } from '../entities/channel.entity';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>
  ) {}

  async createMessage(content: string, fromUser: User, channel: Channel): Promise<Message> {
    this.logger.debug(`Создание сообщения: content=${content}`);
    this.logger.debug(`Пользователь: ${JSON.stringify(fromUser)}`);
    this.logger.debug(`Канал: ${JSON.stringify(channel)}`);

    if (!content) {
      this.logger.error('Отсутствует содержимое сообщения');
      throw new BadRequestException('Отсутствуют обязательные поля: содержимое');
    }
    
    if (!fromUser) {
      this.logger.error('Отсутствует пользователь');
      throw new BadRequestException('Отсутствуют обязательные поля: пользователь');
    }
    
    if (!channel) {
      this.logger.error('Отсутствует канал');
      throw new BadRequestException('Отсутствуют обязательные поля: канал');
    }

    try {
      const message = this.messageRepository.create({
        
        content,
        from_user: fromUser,
        channel
      });

      const savedMessage = await this.messageRepository.save(message);
      this.logger.debug(`Сообщение сохранено: ${JSON.stringify(savedMessage)}`);
      return savedMessage;
    } catch (error) {
      this.logger.error(`Ошибка при сохранении сообщения: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getMessagesByChannelId(channelId: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { 
        channel: { id: channelId } as any 
      },
      relations: ['from_user'],
      order: { timestamp: 'ASC' }
    });
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['from_user']
    });

    if (!message) {
      throw new NotFoundException('Сообщение не найдено');
    }

    if (message.from_user.id !== userId) {
      throw new ForbiddenException('У вас нет прав на удаление этого сообщения');
    }

    await this.messageRepository.remove(message);
  }
} 