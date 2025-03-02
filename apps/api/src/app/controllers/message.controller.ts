import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { Message } from '../entities/message.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async createMessage(
    @Body('content') content: string,
    @Body('channelId') channelId: string,
    @Request() req
  ): Promise<Message> {
    return await this.messageService.createMessage(content, channelId, req.user);
  }

  @Get('channel/:channelId')
  async getMessagesByChannelId(@Param('channelId') channelId: string): Promise<Message[]> {
    return await this.messageService.getMessagesByChannelId(channelId);
  }

  @Delete(':id')
  async deleteMessage(
    @Param('id') id: string,
    @Request() req
  ): Promise<void> {
    await this.messageService.deleteMessage(id, req.user.id);
  }
} 