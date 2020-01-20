import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { NotificationService } from '@api/notification/services/notification.service';
import { SubscriptionLabel } from '@helping-hand/api-common';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Query('label') label: string): Observable<boolean> {
    return this.notificationService.create(label as SubscriptionLabel);
  }
}
