import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {
  NbCardModule,
  NbLayoutModule,
  NbSidebarModule,
  NbTabsetModule,
  NbStepperModule,
  NbButtonModule,
  NbInputModule,
  NbSpinnerModule
} from '@nebular/theme';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    NbLayoutModule,
    NbCardModule,
    NbSidebarModule,
    NbTabsetModule,
    NbStepperModule,
    NbButtonModule,
    NbInputModule,
    NbSpinnerModule
  ]
})
export class DashboardModule {}
