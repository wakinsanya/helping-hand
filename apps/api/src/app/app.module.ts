import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { MediaModule } from './media/media.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { FavorModule } from './favor/favor.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { NotificationModule } from './notification/notification.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    MediaModule,
    DatabaseModule,
    AuthModule,
    ProfileModule,
    FavorModule,
    SubscriptionModule,
    NotificationModule,
    PostModule,
    CommentModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
