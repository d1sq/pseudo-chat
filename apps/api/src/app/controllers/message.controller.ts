import { Controller, Get, Post, Body, Param, Delete, Request, UseGuards, BadRequestException, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { Message } from '../entities/message.entity';
import { ChannelService } from '../services/channel.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  private readonly logger = new Logger(MessageController.name);

  constructor(
    private readonly messageService: MessageService,
    private readonly channelService: ChannelService
  ) {}

  @Post()
  async createMessage(
    @Body('content') content: string,
    @Body('channelId') channelId: string,
    @Request() req
  ): Promise<Message> {
    this.logger.debug(`Создание сообщения: content=${content}, channelId=${channelId}`);
    this.logger.debug(`Пользователь из запроса: ${JSON.stringify(req.user)}`);

    if (!content || !content.trim()) {
      throw new BadRequestException('Содержание сообщения не может быть пустым');
    }

    const channel = await this.channelService.getChannelById(channelId);
    if (!channel) {
      throw new NotFoundException('Канал не найден');
    }

    this.logger.debug(`Канал найден: ${JSON.stringify(channel)}`);
    
    try {
      const message = await this.messageService.createMessage(content, req.user, channel);
      this.logger.debug(`Сообщение создано: ${JSON.stringify(message)}`);
      return message;
    } catch (error) {
      this.logger.error(`Ошибка при создании сообщения: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('channel/:channelId')
  async getMessagesByChannelId(
    @Param('channelId') channelId: string
  ): Promise<Message[]> {
    const channel = await this.channelService.getChannelById(channelId);
    if (!channel) {
      throw new NotFoundException('Канал не найден');
    }
    
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