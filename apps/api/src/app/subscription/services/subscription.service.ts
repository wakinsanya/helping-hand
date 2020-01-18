import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { SUBSCRIPTION_MODEL } from '@api/constants';
import { Subscription, SubscriptionLabel } from '@helping-hand/api-common';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubscriptionDocument } from '@api/subscription/interfaces/subscription-document.interface';

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject(SUBSCRIPTION_MODEL)
    private readonly subscriptionModel: Model<SubscriptionDocument>
  ) {}

  create(subscription: Subscription): Observable<Subscription> {
    return from(this.subscriptionModel.create(subscription)).pipe(
      map((subDoc: SubscriptionDocument) => subDoc as Subscription)
    );
  }

  getById(_id: string): Observable<Subscription> {
    return from(this.subscriptionModel.findOne({ _id })).pipe(
      map((subDoc: SubscriptionDocument) => subDoc as SubscriptionDocument)
    );
  }

  list(owner: string, labels: string[]): Observable<Subscription[]> {
    return from(
      this.subscriptionModel.find({
        owner,
        label: { $in: labels }
      })
    ).pipe(
      map((subDocs: Subscription[]) => subDocs as Subscription[])
    );
  }

  delete(_id: string): Observable<any> {
    return from(this.subscriptionModel.deleteOne({ _id }));
  }

  getByLabel(label: SubscriptionLabel): Observable<Subscription[]> {
    return from(
      this.subscriptionModel.find({ label })
    ).pipe(
      map((subDocs: Subscription[]) => subDocs as Subscription[])
    )
  }
}
