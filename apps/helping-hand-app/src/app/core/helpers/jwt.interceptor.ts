import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const loggedInUser = this.userService.loggedInUser;
    if (loggedInUser && loggedInUser.access_token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${loggedInUser.access_token}`
        }
      });
    }
    return next.handle(request);
  }
}
