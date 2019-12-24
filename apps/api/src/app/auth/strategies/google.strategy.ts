import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthStrategies } from '../../enums/auth-strategies.enum';
import { ConfigService } from '../../config/config.service';
import { ConfigKeys } from '../../enums/config-keys.enum';
import { AuthService } from '../services/auth.service';
import { Providers } from '@helping-hand/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  AuthStrategies.GOOGLE
) {
  constructor(
    protected readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      clientID: configService.get(ConfigKeys.GOOGLE_CLIENT_ID),
      clientSecret: configService.get(ConfigKeys.GOOGLE_CLIENT_SECRET),
      callbackURL: configService.get(ConfigKeys.GOOGLE_CALLBACK_URL),
      passReqToCallback: true,
      scope: ['profile']
    });
  }

  async validate(
    _req: any,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: Function
  ) {
    try {
      console.log(profile);

      const jwt = this.authService.validateOAuthLogin(
        profile.id,
        Providers.GOOGLE
      );
      const user = {
        jwt
      };

      done(null, user);
    } catch (e) {
      done(e, false);
    }
  }
}
