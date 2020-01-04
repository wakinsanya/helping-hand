import { Component, OnDestroy, OnInit } from '@angular/core';
import { User, UserProvider } from '@helping-hand/api-common';
import { Router } from '@angular/router';
import { NbAuthService, NbAuthResult } from '@nebular/auth';
import { NbToastrService } from '@nebular/theme';
import { tap, takeUntil, delay, first } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'helping-hand-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  loggedInUser: User;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: NbAuthService
  ) {}

  ngOnInit() {
    this.userService.loggedInUser$
      .pipe(
        takeUntil(this.destroy$),
        tap((user: User) => {
          this.loggedInUser = user;
        })
      )
      .subscribe({ error: e => console.error(e) });
  }

  logout() {
    this.authService
      .logout(this.userService.userProvider)
      .pipe(
        tap(() => {
          this.userService.removeLoggedInUser();
          this.userService.removeUserProvider();
        })
      )
      .subscribe({
        next: () => this.router.navigate(['/auth/login']),
        error: e => console.error(e)
      });
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
