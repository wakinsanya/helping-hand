import { Module } from '@nestjs/common';
import { DatabaseModule } from '@api/database/database.module';
import { commentProviders } from './providers/comment.providers';
import { CommentService } from './services/comment.service';
import { CommentController } from './controllers/comment.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CommentController],
  providers: [CommentService, ...commentProviders],
  exports: [CommentService]
})
export class CommentModule {}
