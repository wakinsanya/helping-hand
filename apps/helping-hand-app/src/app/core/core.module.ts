import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnsureModuleLoadedOnceGuard } from '@helping-hand/core/helpers/ensure-module-loaded-once.guard';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { CustomOverlayService } from './services/custom-overlay.service';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbActionsModule } from '@nebular/theme';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, FormsModule, NbEvaIconsModule, NbActionsModule],
  providers: [AuthService, CustomOverlayService],
  exports: [HeaderComponent]
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
