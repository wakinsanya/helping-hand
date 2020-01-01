import { Injectable } from '@angular/core';
import { UserProvider, User, CreateUserDto } from '@helping-hand/api-common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { environment } from '@helping-hand-environments/environment';
@Injectable()
export class UserService {
  private _loggedInUser$: BehaviorSubject<User>;
  public loggedInUser$: Observable<User>;
  public userProvider: UserProvider;

  public get loggedInUser(): User {
    return this._loggedInUser$.value;
  }

  constructor(private httpClient: HttpClient) {
    this._loggedInUser$ = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('loggedInUser'))
    );
    this.loggedInUser$ = this._loggedInUser$.asObservable();
  }

  setLoggedInUser(user: User) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    this._loggedInUser$.next(user);
  }

  removeLoggedInUser() {
    localStorage.removeItem('loggedInUser');
    this._loggedInUser$.next(null);
  }

  createUser(provider: UserProvider, payload: any): Observable<User> {
    const userDto = this.getCreateUserDto(provider, payload);
    return this.httpClient.post<User>('/api/users', userDto);
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>('/api/users');
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
          `${environment.googlePayloadBaseUrl}?access_token=${access_token}`
        );
      default:
        throw new Error('unknown provider');
    }
  }
}
