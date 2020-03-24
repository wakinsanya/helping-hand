import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { CommunityComponent } from './components/community/community.component';
import { FeedComponent } from './components/feed/feed.component';
import { PostComponent } from './components/post/post.component';

const routes: Routes = [
  {
    path: 'feed',
    component: FeedComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'community',
    component: CommunityComponent
  },
  {
    path: 'post/:postId',
    component: PostComponent
  },
  { path: '**', pathMatch: 'full', redirectTo: 'pages/feed' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
