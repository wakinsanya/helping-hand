import { Injectable } from '@angular/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UsersService } from '@api/users/services/users.service';
import { User } from '@helping-hand/api-common';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  validateOAuthUser(thirdPartyId: string): Observable<User> {
    return this.usersService.getByThirdPartyId(thirdPartyId);
  }

  login(user: User): { access_token: string } {
    const payload = { thirdPartyId: user.thirdPartyId };
    return { access_token: this.jwtService.sign(payload) };
  }
}
