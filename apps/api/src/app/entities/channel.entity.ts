import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Message } from './message.entity';
import { UserChannel } from './user-channel.entity';

@Entity('channels')
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Message, message => message.channel)
  messages: Message[];

  @OneToMany(() => UserChannel, userChannel => userChannel.channel)
  userChannels: UserChannel[];
} 