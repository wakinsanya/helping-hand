import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnsureModuleLoadedOnceGuard } from '@helping-hand/core/helpers/ensure-module-loaded-once.guard';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { CustomOverlayService } from './services/custom-overlay.service';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbActionsModule, NbUserModule, NbToastrModule } from '@nebular/theme';
import { UserService } from './services/user.service';
import { ProfileService } from './services/profile.service';
import { EventBusService } from './services/event-bus.service';
import { FavorService } from './services/favor.service';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    NbEvaIconsModule,
    NbActionsModule,
    NbUserModule,
    NbToastrModule
  ],
  providers: [
    AuthService,
    CustomOverlayService,
    UserService,
    ProfileService,
    FavorService,
    EventBusService
  ],
  exports: [HeaderComponent]
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
