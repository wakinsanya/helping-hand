import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/services/config.service';
import { ConfigKeys } from '../../enums/config-keys.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(ConfigKeys.JWT_SECRET_KEY),
      ignoreExpiration: false
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
