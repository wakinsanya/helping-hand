import { Injectable } from '@angular/core';
import { Subscription, SubscriptionLabel } from '@helping-hand/api-common';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, Subscriber } from 'rxjs';
import { SwPush } from '@angular/service-worker';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class SubscriptionService {
  constructor(private httpClient: HttpClient, private swPush: SwPush) {}

  createSubscription(sub: Subscription): Observable<Subscription> {
    return this.httpClient.post<Subscription>('api/subscriptions', sub);
  }

  getSubscriptionById(subId: string): Observable<Subscription> {
    return this.httpClient.get<Subscription>(`api/profiles/${subId}`);
  }

  deleteSubscription(subId: string): Observable<any> {
    return this.httpClient.delete(`api/subscriptions/${subId}`);
  }

  requestSubscription(serverPublicKey: string, label: SubscriptionLabel,  owner: string) {
    from(this.swPush.requestSubscription({
      serverPublicKey
    })).pipe(
      mergeMap((sub) => {
        console.log(sub);
        // return this.createSubscription({
        //   owner,
        //   label,
        //   subscription: {
        //     endpoint: sub.endpoint,
        //     expirationTime: sub.expirationTime,
        //     keys: {

        //     }
        //   }
        // })
        return of();
      })
    )
  }
}
