import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersModule } from '@api/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@api/auth/controllers/auth.controller';
import { ConfigModule } from '@api/config/config.module';
import { ConfigService } from '@api/config/services/config.service';
import { ConfigKeys } from '@api/enums/config-keys.enum';
import { JwtStrategy } from '@api/auth/strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(ConfigKeys.JWT_SECRET_KEY),
        signOptions: { expiresIn: '604800s' }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
  controllers: [AuthController]
})
export class AuthModule {}
