import { Module } from '@nestjs/common';
import { KnexModule } from './knex.module';
import { PuppyRequestsModule } from './modules/puppy-requests/puppy-requests.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
      isGlobal: true,
    }),
    KnexModule.register(),
    PuppyRequestsModule,
  ],
})
export class AppModule {}