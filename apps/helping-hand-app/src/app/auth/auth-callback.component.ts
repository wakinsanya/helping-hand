import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '@helping-hand/core/services/user.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'helping-hand-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements AfterViewInit {
  constructor(
    private router: Router,
    private userService: UserService,
    private toastrService: NbToastrService
  ) {}

  ngAfterViewInit() {
    this.userService.grantApiAcess(this.userService.loggedInUser).subscribe({
      next: () => {
        localStorage.removeItem('isLogginIn');
        this.router.navigateByUrl('/dashboard');
      },
      error: e => {
        localStorage.removeItem('isLogginIn');
        this.toastrService.danger(
          'We were unable to complete your login, please try again.'
        );
        console.error(e);
      }
    });
  }
}
