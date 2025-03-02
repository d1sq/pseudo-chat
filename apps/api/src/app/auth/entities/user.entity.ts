export class User {
  id: number;
  username: string;
  password: string;
  email: string;
  
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
} 