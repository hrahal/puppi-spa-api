import { Module, DynamicModule, Provider, Global } from '@nestjs/common';
import knex, { Knex } from 'knex';

interface KnexModuleOptions {
  config: Knex.Config;
}

const KNEX_CONNECTION = 'KNEX_CONNECTION';

const knexProvider: Provider = {
  provide: KNEX_CONNECTION,
  useFactory: async (options: KnexModuleOptions) => {
    return knex(options.config);
  },
  inject: ['KNEX_MODULE_OPTIONS'],
};

@Global()
@Module({})
export class KnexModule {
  static register(options: KnexModuleOptions): DynamicModule {
    return {
      module: KnexModule,
      providers: [
        {
          provide: 'KNEX_MODULE_OPTIONS',
          useValue: options,
        },
        knexProvider,
      ],
      exports: [KNEX_CONNECTION],
    };
  }
}