import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { NotificationService } from '@api/notification/services/notification.service';
import { SubscriptionLabel } from '@helping-hand/api-common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Query('label') label: string): Observable<boolean> {
    return this.notificationService.create(label as SubscriptionLabel);
  }
}
