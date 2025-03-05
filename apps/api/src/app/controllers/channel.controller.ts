import { Controller, Get, Post, Body, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ChannelService } from '../services/channel.service';
import { Channel } from '../entities/channel.entity';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('channels')
@UseGuards(JwtAuthGuard)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  async createChannel(
    @Body('name') name: string,
    @Request() req
  ): Promise<Channel> {
    return await this.channelService.createChannel(name, req.user);
  }

  @Get()
  async getAllChannels(): Promise<Channel[]> {
    return await this.channelService.getAllChannels();
  }

  @Get(':id')
  async getChannelById(@Param('id') id: string): Promise<Channel | null> {
    return await this.channelService.getChannelById(id);
  }

  @Get(':id/users')
  async getChannelUsers(@Param('id') id: string): Promise<Partial<User>[]> {
    const users = await this.channelService.getChannelUsers(id);
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  @Delete(':id')
  async deleteChannel(
    @Param('id') id: string,
    @Request() req
  ): Promise<void> {
    await this.channelService.deleteChannel(id, req.user.id);
  }
} 