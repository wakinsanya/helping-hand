import { Connection } from 'mongoose';
import { DATABASE_CONNECTION, SUBSCRIPTION_MODEL } from '@api/constants';
import { SubscriptionSchema } from '@api/subscription/schemas/subscription.schema';
import { SubscriptionDocument } from '@api/subscription/interfaces/subscription-document.interface';

export const subscriptionProviders = [
  {
    provide: SUBSCRIPTION_MODEL,
    useFactory: (connection: Connection) => {
      return connection.model<SubscriptionDocument>(
        'Subscription',
        SubscriptionSchema
      );
    },
    inject: [DATABASE_CONNECTION]
  }
];
