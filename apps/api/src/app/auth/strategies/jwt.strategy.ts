import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UserService } from '../../services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret-key', 
    });
  }

  async validate(payload: any) {
    this.logger.debug(`JWT payload: ${JSON.stringify(payload)}`);
    
    const userId = typeof payload.sub === 'number' ? payload.sub.toString() : payload.sub;
    this.logger.debug(`Ищем пользователя по ID: ${userId}, тип: ${typeof userId}`);
    
    const user = await this.userService.findById(userId);
    this.logger.debug(`Найденный пользователь: ${JSON.stringify(user)}`);
    
    if (!user) {
      this.logger.error(`Пользователь с ID ${userId} не найден`);
      throw new UnauthorizedException('Пользователь не найден');
    }
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
} 