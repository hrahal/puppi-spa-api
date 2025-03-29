import { ApiProperty } from "@nestjs/swagger";

export enum PuppyService {
  grooming = 'grooming',
  training = 'training',
  walking = 'walking',
  daycare = 'daycare',
}

export class CreatPuppyRequest {
  @ApiProperty()
  date: string; // ISO date-time string

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  dog_name: string;

  @ApiProperty({ isArray: true, enum: ['grooming', 'training', 'walking', 'daycare'] })
  service: PuppyService[];

  @ApiProperty()
  price: number;

  @ApiProperty()
  arrival_time: string; // ISO date-time string

  @ApiProperty()
  is_served: boolean;
  
  @ApiProperty()
  order_number: number
};

export class PuppyRequest extends CreatPuppyRequest {
  @ApiProperty()
  id: number;
};