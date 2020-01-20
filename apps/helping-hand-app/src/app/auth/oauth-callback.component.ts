import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbAuthService, NbAuthResult } from '@nebular/auth';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { takeUntil, tap, switchMap } from 'rxjs/operators';
import { UserService } from '@helping-hand/core/services/user.service';
import { User } from '@helping-hand/api-common';

@Component({
  selector: 'helping-hand-oauth2-callback',
  templateUrl: './oauth-callback.component.html',
  styleUrls: ['./oauth-callback.component.scss']
})
export class OAuth2CallbackComponent implements OnInit, OnDestroy {
  private redirectUrl: string;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: NbAuthService,
    private userService: UserService
  ) {
    this.authService
      .authenticate(this.userService.userProvider)
      .pipe(
        takeUntil(this.destroy$),
        tap((authResult: NbAuthResult) => {
          localStorage.removeItem('isLogginIn');
          this.redirectUrl = authResult.getRedirect();
        }),
        switchMap((authResult: NbAuthResult) => {
          if (authResult.isSuccess() && this.redirectUrl) {
            const token = authResult.getToken();
            return this.userService
              .getUserPayload(
                this.userService.userProvider,
                token.getPayload().access_token
              )
              .pipe(
                switchMap((payload: any) => {
                  return this.userService.createUser(
                    this.userService.userProvider,
                    payload
                  );
                }),
                switchMap((user: User) =>
                  this.userService.loginUser(user.thirdPartyId)
                ),
                tap(isAuthenticated => {
                  if (!isAuthenticated) {
                    throwError(new Error('unable to authenticate with API'));
                  }
                })
              );
          } else {
            return throwError(new Error('authentication with provider failed'));
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

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
