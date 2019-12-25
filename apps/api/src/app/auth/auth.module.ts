import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/services/config.service';
import { ConfigKeys } from '../enums/config-keys.enum';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(ConfigKeys.JWT_SECRET_KEY)
      }),
      inject: [ConfigService]
    })
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
