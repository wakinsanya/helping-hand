import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '@helping-hand/core/services/user.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(e => {
        if (e.status === 401) {
          this.userService.removeUserProvider();
          this.userService.removeLoggedInUser();
          location.reload();
        }
        const error = e.error.message || e.statusText;
        return throwError(error);
      })
    );
  }
}
