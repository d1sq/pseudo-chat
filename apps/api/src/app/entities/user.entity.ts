import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Message } from './message.entity';
import { UserChannel } from './user-channel.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: true })
  is_online: boolean;

  @OneToMany(() => Message, message => message.from_user)
  messages: Message[];

  @OneToMany(() => UserChannel, userChannel => userChannel.user)
  userChannels: UserChannel[];
} 