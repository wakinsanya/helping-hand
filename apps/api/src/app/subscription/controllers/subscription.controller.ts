import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { Subscription } from '@helping-hand/api-common';
import { Observable } from 'rxjs';
import { SubscriptionService } from '@api/subscription/services/subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  create(@Body() sub: Subscription): Observable<Subscription> {
    return this.subscriptionService.create(sub);
  }

  @Get(':subscriptionId')
  get(
    @Param('subscriptionId') subscriptionId: string
  ): Observable<Subscription> {
    return this.subscriptionService.getById(subscriptionId);
  }

  @Delete(':subscriptionId')
  delete(@Param('subscriptionId') subscriptionId: string): Observable<any> {
    return this.subscriptionService.delete(subscriptionId);
  }
}
