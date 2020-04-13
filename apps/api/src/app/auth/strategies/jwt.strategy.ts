import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@api/config/services/config.service';
import { ConfigKeys } from '@api/enums/config-keys.enum';
import { User } from '@helping-hand/api-common';
import { UsersService } from '@api/users/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(ConfigKeys.JwtSecretKey)
    });
  }

  validate(data: { payload: any }): User {
    return (data.payload as User)
  }
}
