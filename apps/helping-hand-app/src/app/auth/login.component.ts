import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { UserProvider } from '@helping-hand/api-common';
import { AuthService } from '@helping-hand/core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first, tap, catchError, takeWhile, takeUntil } from 'rxjs/operators';
import { throwError, Subject, of } from 'rxjs';
import { UserService } from '@helping-hand/core/services/user.service';
import { NbAuthService, NbAuthResult, NbAuthOAuth2Token } from '@nebular/auth';

@Component({
  selector: 'helping-hand-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  token: NbAuthOAuth2Token;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: NbAuthService
  ) {

  }

  login(provider: UserProvider) {
    this.authService
      .authenticate(provider)
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
