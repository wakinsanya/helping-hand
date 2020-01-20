import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Query,
  UseGuards
} from '@nestjs/common';
import { Subscription } from '@helping-hand/api-common';
import { Observable } from 'rxjs';
import { SubscriptionService } from '@api/subscription/services/subscription.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  create(@Body() sub: Subscription): Observable<Subscription> {
    return this.subscriptionService.create(sub);
  }

  @Get()
  list(
    @Query('owner') owner: string,
    @Query('labels') labels: string
  ): Observable<Subscription[]> {
    return this.subscriptionService.list(
      owner,
      labels && labels.length ? labels.split(',') : []
    );
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
