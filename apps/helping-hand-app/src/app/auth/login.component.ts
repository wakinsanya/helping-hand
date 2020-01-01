import { Component, OnDestroy } from '@angular/core';
import { UserProvider } from '@helping-hand/api-common';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NbAuthService, NbAuthOAuth2Token } from '@nebular/auth';

@Component({
  selector: 'helping-hand-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  token: NbAuthOAuth2Token;
  private destroy$ = new Subject<void>();

  constructor(private authService: NbAuthService) {}

  login(provider: string) {
    this.authService
      .authenticate(provider as UserProvider)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: e => {
          console.error(e);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
