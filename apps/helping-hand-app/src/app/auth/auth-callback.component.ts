import { Component, AfterViewInit } from '@angular/core';
import { UserService } from '@helping-hand/core/services/user.service';
import { Router } from '@angular/router';
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
      next: () => this.router.navigateByUrl('/pages/feed'),
      error: err => {
        this.toastrService.danger(
          'We were unable to complete your login, please try again.'
        );
        console.error(err);
      }
    });
  }
}
