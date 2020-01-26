import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthRoutingModule } from './auth-routing.module';
import { NbAuthModule } from '@nebular/auth';
import {
  NbButtonModule,
  NbCardModule,
  NbSpinnerModule,
  NbIconModule,
  NbLayoutModule
} from '@nebular/theme';
import { LoginComponent } from './login.component';
import { OAuth2CallbackComponent } from './oauth-callback.component';
import { AuthCallbackComponent } from './auth-callback.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbButtonModule,
    AuthRoutingModule,
    NbAuthModule,
    NbCardModule,
    NbSpinnerModule,
    NbIconModule,
    NbLayoutModule
  ],
  declarations: [LoginComponent, OAuth2CallbackComponent, AuthCallbackComponent]
})
export class AuthModule {}
