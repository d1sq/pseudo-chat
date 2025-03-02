import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Channel } from '../../interfaces/channel.interface';

@Component({
  selector: 'app-channels-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channels-list.component.html',
  styleUrls: ['./channels-list.component.scss']
})
export class ChannelsListComponent {
  @Input() channels: Channel[] | null = [];
  @Input() selectedChannelId: string | undefined | null = null;
  
  @Output() channelSelect = new EventEmitter<string>();
} 