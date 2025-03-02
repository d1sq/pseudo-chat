import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';
import { Channel } from '../entities/channel.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>
  ) {}

  async createMessage(content: string, channelId: string, user: User): Promise<Message> {
    const channel = await this.channelRepository.findOne({ where: { id: channelId } });
    if (!channel) {
      throw new Error('Channel not found');
    }

    const message = this.messageRepository.create({
      content,
      channel,
      user
    });

    return await this.messageRepository.save(message);
  }

  async getMessagesByChannelId(channelId: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { channel: { id: channelId } },
      relations: ['user'],
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async deleteMessage(id: string, userId: string): Promise<void> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!message) {
      throw new Error('Message not found');
    }

    if (message.user.id !== userId) {
      throw new Error('Unauthorized to delete this message');
    }

    await this.messageRepository.delete(id);
  }
} 