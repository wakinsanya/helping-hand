import { Injectable } from '@angular/core';
import { JwtService } from '@nestjs/jwt';
import { Observable, of, throwError } from 'rxjs';
import { UsersService } from '@api/users/services/users.service';
import { User } from '@helping-hand/api-common';
import { switchMap } from 'rxjs/operators';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  validateOAuthUser(thirdPartyId: string): Observable<User> {
    return this.usersService.getByThirdPartyId(thirdPartyId);
  }

  login(user: User): Observable<{ access_token: string }> {
    return this.usersService.getById(user._id).pipe(
      switchMap(payload => {
        return payload
          ? of({ access_token: this.jwtService.sign({ payload }) })
          : throwError(
              new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
            );
      })
    );
  }
}
