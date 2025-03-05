import { User } from './user.interface';

export interface Message {
  id: string;
  content: string;
  fromUser: User;
  timestamp: Date;
}
