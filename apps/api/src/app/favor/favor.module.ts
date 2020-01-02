import { Module } from '@nestjs/common';
import { DatabaseModule } from '@api/database/database.module';
import { FavorController } from '@api/favor/controllers/favor.controller';
import { FavorService } from '@api/favor/services/favor.service';
import { favorProviders } from '@api/favor/providers/favor.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [FavorController],
  providers: [FavorService, ...favorProviders],
  exports: [FavorService]
})
export class FavorModule {}
