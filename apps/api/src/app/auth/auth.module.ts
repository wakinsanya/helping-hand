import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersModule } from '@api/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@api/auth/controllers/auth.controller';
import { GoogleStrategy } from '@api/auth/strategies/google.strategy';
import { ConfigModule } from '@api/config/config.module';
import { ConfigService } from '@api/config/services/config.service';
import { ConfigKeys } from '@api/enums/config-keys.enum';
import { JwtStrategy } from '@api/auth/strategies/jwt.strategy';

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
