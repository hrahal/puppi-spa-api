import { Module } from '@nestjs/common';
import { KnexModule } from './knex.module';
import { PuppyRequestsModule } from './modules/puppy-requests/puppy-requests.module';  

@Module({
  imports: [
    KnexModule.register({
      config: {
        client: 'pg',
        connection: {
            host: "db.wmvlnwuierenokuibxys.supabase.co",
            user: "postgres",
            port: 5432,
            database: "postgres",
            password: "VWJqsLu7wkeOXxSv",
            ssl: {
                rejectUnauthorized: false
            },
        }
      },
    }),
    PuppyRequestsModule,
  ],
})
export class AppModule {}