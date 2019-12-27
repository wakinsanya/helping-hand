import { Injectable } from '@angular/core';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { Providers, User } from '@helping-hand/api-common';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  validateOAuthLogin(
    thirdPartyId: string,
    firstName: string,
    lastName: string,
    provider: Providers,
    pictureUrl?: string
  ): Observable<string> {
    return this.usersService.getByThirdPartyId(thirdPartyId).pipe(
      mergeMap((user: User) => {
        if (user) {
          return of(user);
        } else {
          return this.usersService.create({
            firstName,
            lastName,
            thirdPartyId,
            provider,
            pictureUrl
          });
        }
      }),
      mergeMap(() => {
        const jwt: string = this.jwtService.sign({
          thirdPartyId,
          provider
        });
        return of(jwt);
      })
    );
  }
}
