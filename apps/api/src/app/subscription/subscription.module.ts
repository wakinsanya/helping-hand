import { Module } from '@nestjs/common';
import { DatabaseModule } from '@api/database/database.module';
import { SubscriptionService } from './services/subscription.service';
import { subscriptionProviders } from './providers/subscription.providers';
import { SubscriptionController } from './controllers/subscription.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, ...subscriptionProviders],
  exports: [SubscriptionService]
})
export class SubscriptionModule {}
