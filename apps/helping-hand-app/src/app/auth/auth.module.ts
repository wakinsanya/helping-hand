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
  NbIconModule
} from '@nebular/theme';
import { LoginComponent } from './login.component';

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
    NbIconModule
  ],
  declarations: [LoginComponent]
})
export class AuthModule {}
