import { Module } from '@nestjs/common';
import { ProfileController } from '@api/profile/controllers/profile.controller';
import { DatabaseModule } from '@api/database/database.module';
import { ProfileService } from '@api/profile/services/profile.service';
import { profileProviders } from '@api/profile/providers/profile.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ProfileController],
  providers: [ProfileService, ...profileProviders],
  exports: [ProfileService]
})
export class ProfileModule {}
