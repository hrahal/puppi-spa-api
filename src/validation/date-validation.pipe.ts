import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { z } from 'zod';

const dateSchema = z.string().date();

@Injectable()
export class DateValidationPipe implements PipeTransform {
  transform(value: string) {
    try {
      dateSchema.parse(value);
      return value;
    } catch (error) {
      throw new BadRequestException('Invalid date format');
    }
  }
}