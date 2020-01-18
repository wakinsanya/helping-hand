import { Controller, Post, Query } from '@nestjs/common';
import { NotificationService } from '@api/notification/services/notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Query('label') label: string) {

  }
}
