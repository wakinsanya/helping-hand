import { Module } from '@nestjs/common';
import { databaseProviders } from '@api/database/providers/database.providers';
import { ConfigModule } from '@api/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [...databaseProviders],
  exports: [...databaseProviders]
})
export class DatabaseModule {}
