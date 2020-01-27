import { Injectable, EventEmitter } from '@angular/core';
import {
  UserProvider,
  User,
  CreateUserDto,
  UpdateUserDto,
  UserQuery,
  UserQueryResult
} from '@helping-hand/api-common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { environment } from '@helping-hand-environments/environment';
import { queryString } from '../helpers/query-string';
import { tap, map, switchMap } from 'rxjs/operators';

@Injectable()
export class UserService {
  private _loggedInUser$: BehaviorSubject<User>;
  private _userProvider$: BehaviorSubject<UserProvider>;
  public loggedInUser$: Observable<User>;
  public userProvider$: Observable<UserProvider>;

  public get loggedInUser(): User {
    return this._loggedInUser$.value;
  }

  public get userProvider(): UserProvider {
    return this._userProvider$.value;
  }

  constructor(private httpClient: HttpClient) {
    this._loggedInUser$ = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('loggedInUser'))
    );
    this.loggedInUser$ = this._loggedInUser$.asObservable();
    this._userProvider$ = new BehaviorSubject<UserProvider>(
      JSON.parse(localStorage.getItem('userProvider'))
    );
    this.userProvider$ = this._userProvider$.asObservable();
  }

  setLoggedInUser(user: User) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    this._loggedInUser$.next(user);
  }

  setUserProvider(provider: UserProvider) {
    localStorage.setItem('userProvider', JSON.stringify(provider));
    this._userProvider$.next(provider);
  }

  removeLoggedInUser() {
    localStorage.removeItem('loggedInUser');
    this._loggedInUser$.next(null);
  }

  removeUserProvider() {
    localStorage.removeItem('userProvider');
    this._userProvider$.next(null);
  }

  grantApiAcess(user: User): Observable<{}> {
    return this.httpClient
      .post<{ access_token: string }>('/api/auth/login', { user: user })
      .pipe(
        tap(({ access_token }) => {
          user.access_token = access_token;
          this.setLoggedInUser(user);
        }),
        switchMap(() => of({}))
      );
  }

  createUser(provider: UserProvider, payload: any): Observable<User> {
    const userDto: CreateUserDto = this.getCreateUserDto(provider, payload);
    return this.httpClient.post<User>('/api/users', userDto);
  }

  updateUser(userId: string, userDto: UpdateUserDto): Observable<any> {
    return this.httpClient.patch<any>(`api/users/${userId}`, userDto);
  }

  getUserById(userId: string): Observable<User> {
    return this.httpClient.get<User>(`api/users/${userId}`);
  }

  getUsers(query: UserQuery): Observable<UserQueryResult> {
    return this.httpClient.get<UserQueryResult>(
      `/api/users${queryString(query)}`
    );
  }

  private getCreateUserDto(
    provider: UserProvider,
    payload: any
  ): CreateUserDto {
    switch (provider) {
      case UserProvider.Google:
        return {
          email: payload.email,
          firstName: payload.given_name,
          lastName: payload.family_name,
          thirdPartyId: payload.id,
          pictureUrl: payload.picture,
          provider: UserProvider.Google
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
      case UserProvider.Google:
        return this.httpClient.get<any>(
          `${environment.googlePayloadBaseUrl}?access_token=${access_token}`
        );
      default:
        throw new Error('unknown provider');
    }
  }
}
