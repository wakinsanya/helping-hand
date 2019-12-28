import { Injectable } from '@angular/core';
import { UserProvider, User } from '@helping-hand/api-common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private _loggedInUser$: BehaviorSubject<User>;
  public loggedInUser$: Observable<User>;

  public get loggedInUser(): User {
    return this._loggedInUser$.value;
  }

  constructor(private httpClient: HttpClient) {
    this._loggedInUser$ = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('loggedInUser'))
    );
    this.loggedInUser$ = this._loggedInUser$.asObservable();
  }

  login(provider: UserProvider) {
    return this.getUserAuthRequest(provider).pipe(
      tap((user: User) => {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        this._loggedInUser$.next(user);
      })
    );
  }

  logout() {
    localStorage.removeItem('loggedInUser');
    this._loggedInUser$.next(null);
  }

  getUserAccessToken(): string {
    return '';
  }

  private getUserAuthRequest(provider: UserProvider): Observable<User> {
    switch (provider) {
      case UserProvider.GOOGLE:
        return this.httpClient.get<User>('/api/auth/google');
      default:
        return throwError(new Error('Unknown provider'));
    }
  }
}
