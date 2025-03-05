import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import { UserChannel } from '../entities/user-channel.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(UserChannel)
    private userChannelRepository: Repository<UserChannel>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async createChannel(name: string, creator: User): Promise<Channel> {
    const channel = this.channelRepository.create({ name });
    const savedChannel = await this.channelRepository.save(channel);

    const userChannel = this.userChannelRepository.create({
      user: creator,
      channel: savedChannel
    });
    await this.userChannelRepository.save(userChannel);

    return savedChannel;
  }

  async getAllChannels(): Promise<Channel[]> {
    return await this.channelRepository.find();
  }

  async getChannelById(id: string): Promise<Channel | null> {
    return await this.channelRepository.findOne({ where: { id } });
  }

  async deleteChannel(id: string, userId: string): Promise<void> {
    const channel = await this.channelRepository.findOne({ where: { id } });
    if (!channel) {
      throw new NotFoundException('Канал не найден');
    }

    const userChannel = await this.userChannelRepository.findOne({
      where: { channel: { id }, user: { id: userId } } as any
    });

    if (!userChannel) {
      throw new ForbiddenException('У вас нет прав на удаление этого канала');
    }

    await this.userChannelRepository.delete({ channel: { id } } as any);
    
    await this.channelRepository.delete(id);
  }

  async getChannelUsers(channelId: string): Promise<User[]> {
    const userChannels = await this.userChannelRepository.find({
      where: { channel: { id: channelId } } as any,
      relations: ['user']
    });
    
    return userChannels.map(uc => {
      const { password, ...userWithoutPassword } = uc.user;
      return userWithoutPassword as User;
    });
  }

  async addUserToChannel(userId: string, channelId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const channel = await this.channelRepository.findOne({ where: { id: channelId } });

    if (!user || !channel) {
      throw new Error('User or channel not found');
    }

    const userChannel = this.userChannelRepository.create({
      user,
      channel
    });
    await this.userChannelRepository.save(userChannel);
  }
} 