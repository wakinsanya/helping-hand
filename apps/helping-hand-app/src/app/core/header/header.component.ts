import { Component, OnDestroy, OnInit } from '@angular/core';
import { User, UserProvider } from '@helping-hand/api-common';
import { Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { NbToastrService } from '@nebular/theme';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'helping-hand-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isUserLoggedIn: boolean;
  loggedInUser: User;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: NbAuthService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit() {
    this.userService.loggedInUser$.pipe(
      takeUntil(this.destroy$),
      tap((user: User) => {
        this.loggedInUser = user;
      })
    ).subscribe({
      error: e => console.error(e)
    });
  }

  logout() {
    this.authService
      .logout(UserProvider.GOOGLE)
      .pipe(
        tap(() => {
          this.userService.removeLoggedInUser();
          this.toastrService.info('Logged out');
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
        },
        error: e => {
          console.error(e);
          this.toastrService.warning(
            'Something went wrong, please refresh the page'
          );
        }
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
