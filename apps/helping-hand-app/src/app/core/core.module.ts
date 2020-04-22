import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnsureModuleLoadedOnceGuard } from '@helping-hand/core/helpers/ensure-module-loaded-once.guard';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { CustomOverlayService } from './services/custom-overlay.service';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbActionsModule,
  NbUserModule,
  NbToastrModule,
  NbContextMenuModule,
  NbIconModule,
  NbSelectModule,
  NbButtonModule,
  NbTooltipModule,
  NbDialogModule,
  NbCardModule
} from '@nebular/theme';
import { UserService } from './services/user.service';
import { ProfileService } from './services/profile.service';
import { EventBusService } from './services/event-bus.service';
import { FavorService } from './services/favor.service';
import { SubscriptionService } from './services/subscription.service';
import { RouterModule } from '@angular/router';
import { CommentService } from './services/comment.service';
import { PostService } from './services/post.service';
import { FooterComponent } from './footer/footer.component';
import { ConfirmComponent } from './confirm/confirm.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ConfirmComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NbEvaIconsModule,
    NbActionsModule,
    NbUserModule,
    NbToastrModule,
    NbContextMenuModule,
    NbIconModule,
    NbSelectModule,
    NbButtonModule,
    NbTooltipModule,
    NbDialogModule.forChild(),
    NbCardModule,
    RouterModule
  ],
  providers: [
    AuthService,
    CustomOverlayService,
    UserService,
    ProfileService,
    FavorService,
    EventBusService,
    CommentService,
    PostService,
    SubscriptionService
  ],
  entryComponents: [ConfirmComponent],
  exports: [
    HeaderComponent,
    FooterComponent,
    ConfirmComponent
  ]
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
