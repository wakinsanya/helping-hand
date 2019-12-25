import { Module } from '@nestjs/common';
import { ProfileController } from './controllers/profile.controller';
import { DatabaseModule } from '../database/database.module';
import { ProfileService } from './services/profile.service';
import { profileProviders } from './providers/profile.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ProfileController],
  providers: [ProfileService, ...profileProviders],
  exports: [ProfileService]
})
export class ProfileModule {}
