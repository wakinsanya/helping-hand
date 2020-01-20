import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@api/config/services/config.service';
import { ConfigKeys } from '@api/enums/config-keys.enum';
import { User } from '@helping-hand/api-common';
import { Observable } from 'rxjs';
import { UsersService } from '@api/users/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(ConfigKeys.JWT_SECRET_KEY)
    });
  }

  validate(payload: { thirdPartyId: string }): Observable<User> {
    return this.usersService.getByThirdPartyId(payload.thirdPartyId);
  }
}
