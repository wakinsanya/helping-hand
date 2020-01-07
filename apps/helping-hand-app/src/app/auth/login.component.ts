import { Component, OnDestroy } from '@angular/core';
import { UserProvider } from '@helping-hand/api-common';
import { takeUntil, map, mergeMap } from 'rxjs/operators';
import { Subject, Subscription, of } from 'rxjs';
import { NbAuthService, NbAuthOAuth2Token } from '@nebular/auth';
import { UserService } from '@helping-hand/core/services/user.service';

@Component({
  selector: 'helping-hand-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  token: NbAuthOAuth2Token;
  userProviderSub$: Subscription;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private userService: UserService,
    private authService: NbAuthService
  ) {}

  login(provider: string) {
    of(provider)
      .pipe(
        takeUntil(this.destroy$),
        map(userProvider => userProvider as UserProvider),
        mergeMap(userProvider => {
          this.userService.setUserProvider(userProvider);
          return of(userProvider);
        }),
        mergeMap(userProvider => {
          return this.authService.authenticate(userProvider);
        })
      )
      .subscribe({ error: e => console.error(e) });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
