import { Injectable } from '@angular/core';
import { Subscription } from '@helping-hand/api-common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SubscriptionService {
  constructor(private httpClient: HttpClient) {}

  createSubscription(sub: Subscription): Observable<Subscription> {
    return this.httpClient.post<Subscription>('api/subscriptions', sub);
  }

  getSubscriptionById(subId: string): Observable<Subscription> {
    return this.httpClient.get<Subscription>(`api/profiles/${subId}`);
  }

  deleteSubscription(subId: string): Observable<any> {
    return this.httpClient.delete(`api/subscriptions/${subId}`);
  }
}
