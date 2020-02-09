import { Module } from '@nestjs/common';
import { DatabaseModule } from '@api/database/database.module';
import { PostController } from '@api/post/controllers/post.controller';
import { PostService } from '@api/post/services/post.service';
import { postProviders } from '@api/post/providers/post.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [PostController],
  providers: [PostService, ...postProviders],
  exports: [PostService]
})
export class PostModule {}
