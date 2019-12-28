import { Injectable } from '@angular/core';
import { UserProvider, User } from '@helping-hand/api-common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class UserService {
  constructor(private httpClient: HttpClient) {

  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>('/api/users');
  }
}
