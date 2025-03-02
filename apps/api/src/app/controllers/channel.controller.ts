import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ChannelService } from '../services/channel.service';
import { Channel } from '../entities/channel.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('channels')
@UseGuards(JwtAuthGuard)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  async createChannel(
    @Body('name') name: string,
    @Body('description') description?: string
  ): Promise<Channel> {
    return await this.channelService.createChannel(name, description);
  }

  @Get()
  async getAllChannels(): Promise<Channel[]> {
    return await this.channelService.getAllChannels();
  }

  @Get(':id')
  async getChannelById(@Param('id') id: string): Promise<Channel> {
    return await this.channelService.getChannelById(id);
  }

  @Delete(':id')
  async deleteChannel(@Param('id') id: string): Promise<void> {
    await this.channelService.deleteChannel(id);
  }
} 