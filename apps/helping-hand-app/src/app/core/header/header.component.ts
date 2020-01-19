import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@helping-hand/api-common';
import { Router, NavigationEnd } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap, takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'helping-hand-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isOnMessages = false;
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
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        tap(e => {
          const { url } = e as NavigationEnd;
          this.isOnMessages = url === '/chat';
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

  goToMessages() {
    this.isOnMessages = true;
    this.router.navigate(['/chat']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
