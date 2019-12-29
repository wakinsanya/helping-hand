import { Injectable } from '@angular/core';
import { UserProvider, User, CreateUserDto } from '@helping-hand/api-common';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY, of } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable()
export class UserService {
  private _loggedInUserProvider: UserProvider;
  private _loggedInUser: User;

  public get loggedInUser(): User {
    return this._loggedInUser;
  }

  public set loggedInUser(user: User) {
    this._loggedInUser = user;
  }

  public get loggedInUserProvider(): UserProvider {
    return this._loggedInUserProvider;
  }

  public set loggedInUserProvider(provider: UserProvider) {
    this._loggedInUserProvider = provider;
  }

  constructor(private httpClient: HttpClient) {}

  createUser(provider: UserProvider, payload: any): Observable<User> {
    const userDto = this.getCreateUserDto(provider, payload);
    return this.httpClient.post<User>('/api/users', userDto);
  }

  private getCreateUserDto(
    provider: UserProvider,
    payload: any
  ): CreateUserDto {
    switch (provider) {
      case UserProvider.GOOGLE:
        return {
          email: payload.email,
          firstName: payload.given_name,
          lastName: payload.family_name,
          thirdPartyId: payload.id,
          pictureUrl: payload.picture,
          provider: UserProvider.GOOGLE
        };
      default:
        throw new Error('unknown provider');
    }
  }

  getUserPayload(
    provider: UserProvider,
    access_token: string
  ): Observable<any> {
    switch (provider) {
      case UserProvider.GOOGLE:
        return this.httpClient.get<any>(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`
        );
      default:
        throw new Error('unknown provider');
    }
  }

  setUserProvider(provider: UserProvider): Observable<any> {
    return of({}).pipe(tap(() => (this.loggedInUserProvider = provider)));
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>('/api/users');
  }
}
