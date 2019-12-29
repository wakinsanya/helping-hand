import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { UserProvider } from '@helping-hand/api-common';
import { AuthService } from '@helping-hand/core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first, tap, catchError, takeWhile } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UserService } from '@helping-hand/core/services/user.service';
import { NbAuthService, NbAuthResult } from '@nebular/auth';

@Component({
  selector: 'helping-hand-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnDestroy {
  private returnUrl: string;
  isLoggingIn: boolean;
  alive = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: NbAuthService
  ) {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(provider: UserProvider) {
    this.isLoggingIn = true;
    this.authService.authenticate(provider)
    .pipe(takeWhile(() => this.alive))
    .subscribe((authResult: NbAuthResult) => {
      if (authResult.isSuccess()) {
        this.router.navigateByUrl('/dashboard');
      }
    });
    // this.authService
    //   .login(provider)
    //   .pipe(
    //     first(),
    //     tap(() => (this.isLoggingIn = false)),
    //     catchError(e => {
    //       this.isLoggingIn = false;
    //       return throwError(e);
    //     })
    //   )
    //   .subscribe({
    //     next: () => this.router.navigate([this.returnUrl]),
    //     error: e => console.error(e)
    //   });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
