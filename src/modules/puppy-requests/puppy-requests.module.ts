import { Module } from '@nestjs/common';
import { PuppyRequestsController } from './puppy-requests.controller';
import { PuppyRequestsService } from './puppy-requests.service';
import { PuppyRepository } from './puppy-requests.repository';
import { KnexModule } from 'src/knex.module';

@Module({
  imports: [KnexModule.register()],
  controllers: [PuppyRequestsController],
  providers: [PuppyRequestsService, PuppyRepository],
})
export class PuppyRequestsModule {} {}
