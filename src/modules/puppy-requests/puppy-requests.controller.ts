import { Body, Controller, Delete, Get, Param, Put, Query, UsePipes, Post } from '@nestjs/common';
import { PuppyRequestsService } from './puppy-requests.service';
import { PuppyRequest } from '../../types/puppy-requests.entity';
import { DateValidationPipe } from 'src/validation/date-validation.pipe';
import { ChangeOrder } from 'src/types/puppy-requests.entity';


@Controller('/api')
export class PuppyRequestsController {
  constructor(private readonly puppyRequestsService: PuppyRequestsService) {}

  @Get('puppy-requests')
  @UsePipes(DateValidationPipe)
  async findAll(@Query('date') date: string): Promise<PuppyRequest[]> {
    console.log(date);
    return this.puppyRequestsService.findAll(date);
  }

  @Post('puppy-requests')
  async create(@Body() body: PuppyRequest): Promise<PuppyRequest> {
    return this.puppyRequestsService.createOne(body);
  }

  @Get('puppy-requests/:id')
  async findOne(@Param('id') id: number): Promise<PuppyRequest> {
    return this.puppyRequestsService.findOne(id);
  }

  @Delete('puppy-requests/:id')
  async deleteOne(@Param('id') id: number): Promise<any> {
    return this.puppyRequestsService.deleteOne(id);
  }

  @Put('puppy-requests/:id')
  async updateOne(@Param('id') id: number, @Body() puppyRequest: PuppyRequest): Promise<PuppyRequest> {
    return this.puppyRequestsService.updateOne(id, puppyRequest);
  }

  @Get('search')
  async search(@Query('q') query: string): Promise<PuppyRequest[]> {
    return this.puppyRequestsService.search(query);
  }
  

  @Post('change-order')
  async changeOrder(@Body() body: ChangeOrder): Promise<PuppyRequest[]> {
    console.log(body);
    return this.puppyRequestsService.changeOrder(body);
  }
}

