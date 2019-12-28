import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { NbThemeModule, NbLayoutModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AppRoutingModule } from './app-routing.module';
import {
  NbAuthModule,
  NbOAuth2AuthStrategy,
  NbOAuth2ResponseType
} from '@nebular/auth';
import { UserProvider } from '@helping-hand/api-common';
import { AuthModule } from './auth/auth.module';

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
    NbAuthModule.forRoot({
      strategies: [
        NbOAuth2AuthStrategy.setup({
          name: UserProvider.GOOGLE,
          redirect: {
            success: '/dashboard',
            failure: null,
          },
          clientId:
            '',
          clientSecret: '',
          authorize: {
            endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
            responseType: NbOAuth2ResponseType.TOKEN,
            scope: 'https://www.googleapis.com/auth/userinfo.profile'
          }
        })
      ],
      forms: {
        login: {
          strategy: UserProvider.GOOGLE,  // strategy id key.
          socialLinks: [{
            title: 'google',
           icon: 'google-outline'
          }],
        }
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
