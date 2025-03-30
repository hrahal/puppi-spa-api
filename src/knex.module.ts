import { Module, DynamicModule, Provider, Global } from '@nestjs/common';
import knex, { Knex } from 'knex';
import { ConfigService } from '@nestjs/config'; // Import ConfigService

export const KNEX_CONNECTION = 'KNEX_CONNECTION';

const knexProvider: Provider = {
  provide: KNEX_CONNECTION,
  useFactory: async (configService: ConfigService): Promise<Knex> => { // Inject ConfigService
    return knex({
      client: 'pg',
      connection: {
        host: configService.get<string>('POSTGRES_HOST'),
        user: configService.get<string>('POSTGRES_USER'),
        port: configService.get<number>('POSTGRES_PORT'),
        database: configService.get<string>('POSTGRES_DATABASE'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        ssl: {
          rejectUnauthorized: false,
        },
      },
    });
  },
  inject: [ConfigService], // Inject ConfigService
};

@Global()
@Module({})
export class KnexModule {
  static register(): DynamicModule { // Remove options parameter
    return {
      module: KnexModule,
      providers: [knexProvider], // Remove 'KNEX_MODULE_OPTIONS' provider
      exports: [KNEX_CONNECTION],
    };
  }
}