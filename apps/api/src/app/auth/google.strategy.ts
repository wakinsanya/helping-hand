import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthStrategies } from '../enums/auth-strategies.enum';
import { ConfigService } from '../config/config.service';
import { ConfigKeys } from '../enums/config-keys.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  AuthStrategies.GOOGLE
) {
  constructor(public configService: ConfigService) {
    super({
      clientID: configService.get(ConfigKeys.GOOGLE_CLIENT_ID),
      clientSecret: configService.get(ConfigKeys.GOOGLE_CLIENT_SECTET),
      callbackURL: configService.get(ConfigKeys.GOOGLE_CALLBACK_URL),
      passReqToCallback: true,
      scope: ['profile']
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function
  ) {
    try {
      console.log('Invoked validate fn!');
      console.log('google profile', profile);

      const jwt = 'placeholderJWT';
      const user = {
        jwt
      };

      done(null, user);
    } catch (err) {
      // console.log(err)
      done(err, false);
    }
  }
}
