import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { FavorController } from './controllers/favor.controller';
import { FavorService } from './services/favor.service';
import { favorProviders } from './providers/favor.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [FavorController],
  providers: [FavorService, ...favorProviders],
  exports: [FavorService]
})
export class FavorModule {}
