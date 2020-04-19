import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { UserProvider } from '@helping-hand/api-common';
import { takeUntil, map, switchMap, first, tap } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { NbAuthService, NbAuthOAuth2Token } from '@nebular/auth';
import { UserService } from '@helping-hand/core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'helping-hand-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: NbAuthService
  ) {}

  ngOnInit() {
    this.authService
      .isAuthenticated()
      .pipe(first())
      .subscribe({
        next: isAuthenticated => {
          if (isAuthenticated) {
            this.router.navigateByUrl('/pages/feed');
          }
        },
        error: err => console.error(err)
      });
  }

  login(provider: string) {
    of(provider)
      .pipe(
        takeUntil(this.destroy$),
        map(userProvider => userProvider as UserProvider),
        tap(userProvider => {
          this.userService.setUserProvider(userProvider);
        }),
        switchMap(userProvider => this.authService.authenticate(userProvider))
      )
      .subscribe({ error: err => console.error(err) });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
