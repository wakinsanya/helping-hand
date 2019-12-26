import { Injectable } from '@angular/core';
import { Providers, User } from '@helping-hand/api-common';
import { HttpClient } from '@angular/common/http';
import { CoreModule } from '@helping-hand/core/core.module';

@Injectable({
  providedIn: CoreModule
})
export class AuthService {
  get loggedInUser(): User {
    return this.loggedInUser;
  }

  set loggedInUser(user: User) {
    this.loggedInUser = user;
  }

  constructor(private httpClient: HttpClient) { }

  login(provider: Providers) {
    switch (provider) {
      case Providers.GOOGLE:
        return this.httpClient.get('/api/auth/google');
      default:
        return new Error('provider is unknown');
    }
  }

  logout() {}

  getUserAccessToken(): string {
    return '';
  }
}
