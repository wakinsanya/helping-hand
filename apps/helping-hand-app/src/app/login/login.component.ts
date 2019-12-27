import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Providers } from '@helping-hand/api-common';
import { AuthService } from '@helping-hand/core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'helping-hand-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  private returnUrl: string;

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

  login(provider: Providers) {
    this.authService
      .login(provider)
      .pipe(first())
      .subscribe({
        next: () => this.router.navigate([this.returnUrl]),
        error: e => console.error(e)
      });
  }
}
