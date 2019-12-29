import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NbCardModule, NbLayoutModule, NbSidebarModule, NbTabsetModule } from '@nebular/theme';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NbLayoutModule,
    NbCardModule,
    NbSidebarModule,
    NbTabsetModule
  ]
})
export class DashboardModule { }
