import { Module } from '@nestjs/common';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
import { ConfigModule } from '@api/config/config.module';
import { SubscriptionModule } from '@api/subscription/subscription.module';

@Module({
  imports: [ConfigModule, SubscriptionModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {}
