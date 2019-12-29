import { Component, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { NbAuthService, NbAuthResult } from '@nebular/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'helping-hand-oauth2-callback',
  templateUrl: './oauth-callback.component.html'
})
export class OAuth2CallbackComponent implements OnDestroy {
  alive = true;

  constructor(private authService: NbAuthService, private router: Router) {
    this.authService
      .authenticate('google')
      .pipe(takeWhile(() => this.alive))
      .subscribe((authResult: NbAuthResult) => {
        console.log(authResult);
        if (authResult.isSuccess()) {
          this.router.navigateByUrl('/dashboard');
        }
      });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
