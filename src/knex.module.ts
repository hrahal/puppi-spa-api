import { Module, DynamicModule, Provider, Global } from '@nestjs/common';
import knex, { Knex } from 'knex';
import { ConfigService } from '@nestjs/config';

export const KNEX_CONNECTION = 'KNEX_CONNECTION';

@Global()
@Module({})
export class KnexModule {
  static register(): DynamicModule {
    const knexProvider: Provider = {
      provide: KNEX_CONNECTION,
      useFactory: async (configService: ConfigService): Promise<Knex> => {
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
      inject: [ConfigService],
    };

    return {
      module: KnexModule,
      providers: [knexProvider],
      exports: [KNEX_CONNECTION],
    };
  }
}