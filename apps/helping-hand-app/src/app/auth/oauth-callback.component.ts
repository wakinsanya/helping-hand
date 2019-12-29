import { Component, OnDestroy } from '@angular/core';
import { takeUntil, mergeMap, tap } from 'rxjs/operators';
import { NbAuthService, NbAuthResult } from '@nebular/auth';
import { Router } from '@angular/router';
import { Subject, EMPTY, throwError, of } from 'rxjs';
import { UserService } from '@helping-hand/core/services/user.service';
import { UserProvider, User } from '@helping-hand/api-common';

@Component({
  selector: 'helping-hand-oauth2-callback',
  templateUrl: './oauth-callback.component.html'
})
export class OAuth2CallbackComponent implements OnDestroy {
  private redirectUrl: string;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: NbAuthService,
    private readonly userService: UserService
  ) {
    this.authService
      .authenticate(UserProvider.GOOGLE)
      .pipe(
        takeUntil(this.destroy$),
        tap((authResult: NbAuthResult) => {
          this.redirectUrl = authResult.getRedirect();
        }),
        mergeMap((authResult: NbAuthResult) => {
          if (authResult.isSuccess() && this.redirectUrl) {
            const token = authResult.getToken();
            return this.userService
              .getUserPayload(
                UserProvider.GOOGLE,
                token.getPayload().access_token
              )
              .pipe(
                mergeMap((payload: any) => {
                  return this.userService.createUser(
                    UserProvider.GOOGLE,
                    payload
                  );
                }),
                tap((user: User) => (this.userService.loggedInUser = user))
              );
          } else {
            return throwError(new Error('authentication failed'));
          }
        })
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl(this.redirectUrl);
        },
        error: e => console.error(e)
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
