 import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { CommunityComponent } from './components/community/community.component';
import { FeedComponent } from './components/feed/feed.component';
import { PostComponent } from './components/post/post.component';

const routes: Routes = [
  {
    path: 'feed',
    component: FeedComponent,
    data: { state: 'feed', animation: 'fade' }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: { state: 'profile', animation: 'fade' }
  },
  {
    path: 'community',
    component: CommunityComponent,
    data: { state: 'community', animation: 'fade' }
  },
  {
    path: 'post/:postId',
    component: PostComponent,
    data: { state: 'post', animation: 'fade' }
  },
  { path: '**', pathMatch: 'full', redirectTo: 'pages/feed',  data: { state: 'feed', animation: 'fade' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
