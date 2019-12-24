import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { MediaModule } from './media/media.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    MediaModule,
    DatabaseModule,
    AuthModule,
    ProfileModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
