import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@helping-hand/core/services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      this.authService.loggedInUser &&
      this.authService.loggedInUser.access_token
    ) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.loggedInUser.access_token}`
        }
      });
    }
    return next.handle(request);
  }
}
