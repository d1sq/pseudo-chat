import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Channel } from '../../interfaces/chat.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import * as ChatSelectors from '../../store/selectors/chat.selectors';
import * as ChatActions from '../../store/actions/chat.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-channels-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channels-list.component.html',
  styleUrls: ['./channels-list.component.scss'],
})
export class ChannelsListComponent {
  channels$: Observable<Channel[]>;
  selectedChannelId$: Observable<string | null>;
  isCollapsed = false;

  private store = inject(Store<AppState>);

  constructor() {
    this.channels$ = this.store.select(ChatSelectors.selectChannels);
    this.selectedChannelId$ = this.store.select(
      ChatSelectors.selectSelectedChannelId
    );
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  selectChannel(channelId: string) {
    this.store.dispatch(ChatActions.selectChannel({ channelId }));
  }

  openCreateChannelDialog() {
    const channelName = prompt('Введите название канала:');
    if (channelName && channelName.trim()) {
      this.store.dispatch(
        ChatActions.createChannel({ name: channelName.trim() })
      );
    }
  }

  deleteChannel(event: Event, channelId: string): void {
    event.stopPropagation();
    if (confirm('Вы уверены, что хотите удалить этот канал?')) {
      this.store.dispatch(ChatActions.deleteChannel({ channelId }));
    }
  }
}
