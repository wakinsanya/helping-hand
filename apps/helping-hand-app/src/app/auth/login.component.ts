import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserProvider } from '@helping-hand/api-common';
import { AuthService } from '@helping-hand/core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first, tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UserService } from '@helping-hand/core/services/user.service';

@Component({
  selector: 'helping-hand-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  private returnUrl: string;
  isLoggingIn: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    if (this.authService.loggedInUser) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  login(provider: UserProvider) {
    this.isLoggingIn = true;
    this.authService
      .login(provider)
      .pipe(
        first(),
        tap(() => (this.isLoggingIn = false)),
        catchError(e => {
          this.isLoggingIn = false;
          return throwError(e);
        })
      )
      .subscribe({
        next: () => this.router.navigate([this.returnUrl]),
        error: e => console.error(e)
      });
  }
}
