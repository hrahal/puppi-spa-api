import { Module } from '@nestjs/common';
import { PuppyRequestsController } from './puppy-requests.controller';
import { PuppyRequestsService } from './puppy-requests.service';
import { PuppyRepository } from './puppy-requests.repository';

@Module({
  imports: [],
  controllers: [PuppyRequestsController],
  providers: [PuppyRequestsService, PuppyRepository],
})
export class PuppyRequestsModule {} {}
