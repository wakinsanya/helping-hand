// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  googleCallbackUrl: 'http://localhost:4200/auth/oauth2/callback',
  googleAuthEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  googleUserScope: 'email proifle',
  googleClientId: '692013025286-5jmca61f1mngnf4q64cr9r9k72pjdr5d.apps.googleusercontent.com',
  googlePayloadBaseUrl: 'https://www.googleapis.com/oauth2/v1/userinfo'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
