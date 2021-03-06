import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import {
  NbCardModule,
  NbLayoutModule,
  NbSidebarModule,
  NbStepperModule,
  NbButtonModule,
  NbInputModule,
  NbSpinnerModule,
  NbUserModule,
  NbToastrModule,
  NbListModule,
  NbAccordionModule,
  NbIconModule,
  NbDatepickerModule,
  NbActionsModule,
  NbDialogModule,
  NbPopoverModule,
  NbToggleModule,
  NbTooltipModule,
  NbSelectModule
} from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { FavorRequestListComponent } from './components/favor-request-list/favor-request-list.component';
import { FavorListComponent } from './components/favor-list/favor-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CommunityComponent } from './components/community/community.component';
import { CustomShortDatePipe } from './pipes/custom-short-date.pipe';
import { FeedComponent } from './components/feed/feed.component';
import { PostComponent } from './components/post/post.component';
import { PostsManagementComponent } from './components/posts-management/posts-management.component';
import { QuillModule } from 'ngx-quill';
import { PostEditorComponent } from './components/post-editor/post-editor.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { SharedModule } from '@helping-hand/shared/shared.module';

@NgModule({
  declarations: [
    FavorRequestListComponent,
    FavorListComponent,
    ProfileComponent,
    CommunityComponent,
    CustomShortDatePipe,
    FeedComponent,
    PostComponent,
    PostEditorComponent,
    PostsManagementComponent,
    CommentListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PagesRoutingModule,
    FormsModule,
    QuillModule,
    NbLayoutModule,
    NbCardModule,
    NbSidebarModule,
    NbStepperModule,
    NbButtonModule,
    NbInputModule,
    NbSpinnerModule,
    NbUserModule,
    NbToastrModule,
    NbListModule,
    NbSidebarModule,
    NbAccordionModule,
    NbIconModule,
    NbDatepickerModule,
    NbActionsModule,
    NbPopoverModule,
    NbDialogModule.forChild(),
    NbSelectModule,
    NbToggleModule,
    NbTooltipModule
  ],
  exports: [CustomShortDatePipe]
})
export class PagesModule {}
