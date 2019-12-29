import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@helping-hand/core/core.module';
import { NbThemeModule, NbLayoutModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AppRoutingModule } from './app-routing.module';
import {
  NbAuthModule,
  NbOAuth2AuthStrategy,
  NbOAuth2ResponseType
} from '@nebular/auth';
import { UserProvider } from '@helping-hand/api-common';
import { AuthModule } from '@helping-hand/auth/auth.module';
import { AuthGuard } from '@helping-hand/core/helpers/auth.guard';

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
    NbAuthModule.forRoot({
      strategies: [
        NbOAuth2AuthStrategy.setup({
          name: UserProvider.GOOGLE,
          redirect: {
            success: '/dashboard',
            failure: '/auth/login',
          },
          clientId:
            '692013025286-5jmca61f1mngnf4q64cr9r9k72pjdr5d.apps.googleusercontent.com',
          clientSecret: '',
          authorize: {
            endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
            responseType: NbOAuth2ResponseType.TOKEN,
            scope: 'email profile',
            redirectUri: 'http://localhost:4200/auth/oauth2/callback',
          }
        })
      ]
    })
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
