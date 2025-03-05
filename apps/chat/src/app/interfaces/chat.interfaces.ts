export interface User {
  id: string;
  username: string;
  isOnline: boolean;
}

export interface Channel {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  fromUser: User;
  channelId: string;
  content: string;
  timestamp: Date;
}

export interface UserChannel {
  userId: string;
  channelId: string;
}

export interface BackendMessage {
  id: string;
  content: string;
  from_user: {
    id: string;
    username: string;
    is_online: boolean;
  };
  timestamp: Date;
}
