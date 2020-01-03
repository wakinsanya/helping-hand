import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthStrategies } from '../../enums/auth-strategies.enum';
import { ConfigService } from '../../config/services/config.service';
import { ConfigKeys } from '../../enums/config-keys.enum';
import { AuthService } from '../services/auth.service';
import { UserProvider } from '@helping-hand/api-common';
import { tap } from 'rxjs/operators';

enum GoogleOAuthScope {
  Profile = 'profile'
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  AuthStrategies.Google
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
      scope: [GoogleOAuthScope.Profile]
    });
  }

  validate(
    _req: any,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: Function
  ) {
    let user: { jwt: string };
    this.authService
      .validateOAuthLogin(
        profile.id,
        profile.name.givenName,
        profile.name.familyName,
        UserProvider.Google,
        profile.photos.length ? profile.photos[0].value : undefined
      )
      .pipe(tap((jwt: string) => (user = { jwt })))
      .subscribe({
        next: () => done(null, user),
        error: e => done(e, false)
      });
  }
}
