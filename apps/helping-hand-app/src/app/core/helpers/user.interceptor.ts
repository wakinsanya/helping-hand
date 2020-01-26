import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '@helping-hand/core/services/user.service';

@Injectable()
export class UserInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const loggedInUser = this.userService.loggedInUser;
    if (loggedInUser) {
      request = request.clone({
        setHeaders: {
         User: loggedInUser._id
        }
      });
    }
    return next.handle(request);
  }
}
