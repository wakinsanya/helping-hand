export const environment = {
  production: true,
  googleCallbackUrl: 'http://ec2-18-203-234-244.eu-west-1.compute.amazonaws.com/auth/oauth2/callback',
  googleAuthEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  googleUserScope: 'email profile',
  googleClientId: '692013025286-5jmca61f1mngnf4q64cr9r9k72pjdr5d.apps.googleusercontent.com',
  googlePayloadBaseUrl: 'https://www.googleapis.com/oauth2/v1/userinfo',
  vapid: {
    publicKey: 'BNQBovNhmrREVqj4nQBrY8YVeZWgH1qq_yi6kx5h4Y_eobdsW2OHYMdeYKaEhl65rPAToWbmV-OQi6useKoPWaw'
  }
};
