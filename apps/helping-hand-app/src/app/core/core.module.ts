import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnsureModuleLoadedOnceGuard } from '@helping-hand/core/helpers/ensure-module-loaded-once.guard';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@blox/material';
import { AuthService } from './services/auth.service';
import { CustomOverlayService } from './services/custom-overlay.service';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, MatToolbarModule, FormsModule, MaterialModule],
  providers: [AuthService, CustomOverlayService],
  exports: [HeaderComponent]
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
