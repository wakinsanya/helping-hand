import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsetComponent } from './components/tabset/tabset.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CommunityComponent } from './components/community/community.component';

const routes: Routes = [
  {
    path: '',
    component: TabsetComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'community',
    component: CommunityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
