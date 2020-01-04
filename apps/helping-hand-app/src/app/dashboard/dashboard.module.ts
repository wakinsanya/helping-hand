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
  NbSpinnerModule,
  NbUserModule,
  NbToastrModule,
  NbListModule
} from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { FavorRequestListComponent } from './components/favor-request-list/favor-request-list.component';
import { FavorListComponent } from './components/favor-list/favor-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CommunityComponent } from './components/community/community.component';

@NgModule({
  declarations: [
    DashboardComponent,
    FavorRequestListComponent,
    FavorListComponent,
    ProfileComponent,
    CommunityComponent
  ],
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
    NbSpinnerModule,
    NbUserModule,
    NbToastrModule,
    NbListModule
  ]
})
export class DashboardModule {}
