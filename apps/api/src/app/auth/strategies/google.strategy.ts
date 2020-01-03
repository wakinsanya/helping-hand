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

}
