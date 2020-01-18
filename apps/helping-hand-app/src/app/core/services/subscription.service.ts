import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from '@helping-hand-environments/environment';
import {
  Subscription,
  SubscriptionLabel,
  SubscriptionQuery
} from '@helping-hand/api-common';
import { NbToastrService } from '@nebular/theme';
import { from, Observable, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { queryString } from '@helping-hand/core/helpers/query-string';

@Injectable()
export class SubscriptionService {
  constructor(
    private httpClient: HttpClient,
    private swPush: SwPush,
    private toastrService: NbToastrService
  ) {}

  createSubscription(sub: Subscription): Observable<Subscription> {
    return this.httpClient.post<Subscription>('api/subscriptions', sub);
  }

  getSubscriptionById(subId: string): Observable<Subscription> {
    return this.httpClient.get<Subscription>(`api/subscriptions/${subId}`);
  }

  getSubscriptions(query: SubscriptionQuery): Observable<Subscription[]> {
    return this.httpClient.get<Subscription[]>(
      `api/subscriptions${queryString(query)}`
    );
  }

  deleteSubscription(subId: string): Observable<any> {
    return this.httpClient.delete(`api/subscriptions/${subId}`);
  }

  requestSubscription(label: SubscriptionLabel, owner: string) {
    this.getSubscriptions({ owner, labels: [label] })
      .pipe(
        mergeMap(subs => {
          return subs && subs.length
            ? of()
            : from(
                this.swPush.requestSubscription({
                  serverPublicKey: environment.vapid.publicKey
                })
              );
        }),
        mergeMap((sub: PushSubscription) => {
          const parsedSub = sub.toJSON();
          console.log(parsedSub);
          return this.createSubscription({
            owner,
            label,
            subscription: {
              endpoint: parsedSub.endpoint,
              expirationTime: parsedSub.expirationTime,
              keys: {
                p256dh: parsedSub.keys.p26dh,
                auth: parsedSub.keys.auth
              }
            }
          }).pipe(
            tap(() => {
              this.toastrService.info(
                'You will now be able to recieve notifications from Helping Hand.'
              );
            })
          );
        })
      )
      .subscribe({ error: e => console.error(e) });
  }
}
