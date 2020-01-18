import { Injectable } from '@nestjs/common';
import { SubscriptionService } from '@api/subscription/services/subscription.service';
import { SubscriptionLabel, Subscription } from '@helping-hand/api-common';
import { Observable, forkJoin, from, of } from 'rxjs';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { ConfigService } from '@api/config/services/config.service';
import * as webpush from 'web-push';
import { ConfigKeys } from '@api/enums/config-keys.enum';

@Injectable()
export class NotificationService {
  constructor(
    protected configService: ConfigService,
    private readonly subscriptionService: SubscriptionService
  ) {
    webpush.setVapidDetails(
      `mailto:${configService.get(ConfigKeys.APP_EMAIL)}`,
      configService.get(ConfigKeys.VAPID_PUBLIC_KEY),
      configService.get(ConfigKeys.VAPID_PRIVATE_KEY)
    );
  }

  create(label: SubscriptionLabel): Observable<boolean> {
    return this.subscriptionService.getByLabel(label).pipe(
      mergeMap((subs: Subscription[]) => {
        const payload = this.getNotificationPayload(label);
        return forkJoin(
          subs.map(x => {
            return from(
              webpush.sendNotification(x.subscription, JSON.stringify(payload))
            ).pipe(
              catchError(e => {
                console.error('Notification delivery failed!', e);
                return of();
              })
            );
          })
        );
      }),
      map(() => true)
    );
  }

  private getNotificationPayload(label: SubscriptionLabel) {
    switch (label) {
      case SubscriptionLabel.Favor:
        return {
          notification: {
            title: 'Helping Hand',
            body:
              'A favour request has been made,' +
              ' visit Helping Hand to see if you can help the person in need.',
            icon: undefined,
            vibrate: [100, 50, 100],
            data: {
              dateOfArrival: Date.now(),
              primaryKey: 1
            },
            actions: [
              {
                action: 'explore',
                title: 'Go to the site'
              }
            ]
          }
        };
    }
  }
}
