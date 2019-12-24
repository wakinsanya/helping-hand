import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'foo',
      signOptions: { expiresIn: '900s' }
    })
  ],
  providers: [AuthService, GoogleStrategy],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
