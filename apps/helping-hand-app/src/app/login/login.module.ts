import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { NbCardModule, NbIconModule, NbButtonModule } from '@nebular/theme';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule
  ],
  exports: [LoginComponent]
})
export class LoginModule {}
