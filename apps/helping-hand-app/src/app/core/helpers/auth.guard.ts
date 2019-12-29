import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate
} from '@angular/router';
import { CoreModule } from '@helping-hand/core/core.module';
import { NbAuthService } from '@nebular/auth';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: CoreModule })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: NbAuthService) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      tap(authenticated => {
        if (!authenticated) {
          this.router.navigate(['auth/login']);
        }
      })
    );
  }
}
