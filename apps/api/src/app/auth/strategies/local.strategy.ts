import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@api/auth/services/auth.service';
import { Observable, of, throwError } from 'rxjs';
import { User } from '@helping-hand/api-common';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  validate(thirdPartyId: string): Observable<User> {
    return this.authService.validateOAuthUser(thirdPartyId).pipe(
      switchMap((user: User) => {
        return user ? of(user) : throwError(new UnauthorizedException());
      })
    );
  }
}
