import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>
  ) {}

  async createChannel(name: string, description?: string): Promise<Channel> {
    const channel = this.channelRepository.create({ name, description });
    return await this.channelRepository.save(channel);
  }

  async getAllChannels(): Promise<Channel[]> {
    return await this.channelRepository.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async getChannelById(id: string): Promise<Channel> {
    return await this.channelRepository.findOne({
      where: { id },
      relations: ['messages']
    });
  }

  async deleteChannel(id: string): Promise<void> {
    await this.channelRepository.delete(id);
  }
} 