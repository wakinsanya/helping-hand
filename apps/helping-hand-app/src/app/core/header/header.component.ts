import { Component, OnDestroy } from '@angular/core';
import { User } from '@helping-hand/api-common';
import { Router } from '@angular/router';
import { NbAuthService, NbAuthOAuth2Token } from '@nebular/auth';
import { NbToastrService } from '@nebular/theme';
import { tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'helping-hand-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  type = 'default';
  isUserLoggedIn: boolean;
  loggedInUser: User;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: NbAuthService,
    private toasterService: NbToastrService
  ) {

  }

  logout() {
    this.authService
      .logout('google')
      .pipe(tap(() => this.toasterService.info('Logged out')))
      .subscribe({
        next: () => (this.userService.loggedInUser = undefined),
        error: e => {
          console.error(e);
        }
      });
    this.router.navigate(['/']);
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
