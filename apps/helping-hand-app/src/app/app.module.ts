import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from '@helping-hand/app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@helping-hand/core/core.module';
import { NbThemeModule, NbLayoutModule, NbToastrModule, NbDialogModule, NbSidebarModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AppRoutingModule } from '@helping-hand/app-routing.module';
import {
  NbAuthModule,
  NbOAuth2AuthStrategy,
  NbOAuth2ResponseType
} from '@nebular/auth';
import { UserProvider } from '@helping-hand/api-common';
import { AuthModule } from '@helping-hand/auth/auth.module';
import { AuthGuard } from '@helping-hand/core/helpers/auth.guard';
import { JwtInterceptor } from '@helping-hand/core/helpers/jwt.interceptor';
import { ErrorInterceptor } from '@helping-hand/core/helpers/error.interceptor';
import { environment } from '@helping-hand-environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    AuthModule,
    NbThemeModule.forRoot({ name: 'helping-hand' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbToastrModule.forRoot(),
    NbDialogModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbAuthModule.forRoot({
      strategies: [
        NbOAuth2AuthStrategy.setup({
          name: UserProvider.Google,
          redirect: {
            success: '/dashboard',
            failure: '/auth/login'
          },
          clientId: environment.googleClientId,
          clientSecret: '',
          authorize: {
            endpoint: environment.googleAuthEndpoint,
            responseType: NbOAuth2ResponseType.TOKEN,
            scope: environment.googleUserScope,
            redirectUri: environment.googleCallbackUrl
          }
        })
      ]
    })
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
