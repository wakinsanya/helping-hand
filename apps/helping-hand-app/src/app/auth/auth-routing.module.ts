import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent } from '@nebular/auth';
import { LoginComponent } from './login.component';
import { OAuth2CallbackComponent } from './oauth-callback.component';
import { AuthCallbackComponent } from './auth-callback.component';

export const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: { animation: 'fade', state: 'login'}
      },
      {
        path: 'callback',
        component: AuthCallbackComponent,
      },
      {
        path: 'oauth2/callback',
        component: OAuth2CallbackComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
