import { Knex } from 'knex';

import { Inject, Injectable, Query } from '@nestjs/common';
import { KNEX_CONNECTION } from 'src/knex.module';

@Injectable()
export class PuppyRepository {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  public async getAll(date: string): Promise<any> {
    try {
      const startDate = `${date}T00:00:00Z`;
      const endDate = `${date}T23:59:59Z`;

      const query = this.knex
        .select(
          'id',
          'first_name',
          'last_name',
          'dog_name',
          'date',
          'price',
          'arrival_time',
          'is_served',
          'order_number',
          this.knex.raw('"service"::text[]'),
        )
        .from('puppy_requests')
        .where('date', '>=', startDate)
        .andWhere('date', '<=', endDate)
        .orderBy('order_number', 'asc');

      console.log(query.toSQL());

      const data = await query;

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  public async getLastOrder(date: string): Promise<any> {
    try {
      const startDate = `${date}T00:00:00Z`;
      const endDate = `${date}T23:59:59Z`;

      const data = await this.knex
        .select('id', 'order_number')
        .from('puppy_requests')
        .where('date', '>=', startDate)
        .andWhere('date', '<=', endDate)
        .andWhere('is_served', false)
        .orderBy('order_number', 'desc')
        .limit(1);

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  // get one by id
  getOne = async (id: number): Promise<any> => {
    try {
      const data = await this.knex
        .select(
          'id',
          'first_name',
          'last_name',
          'dog_name',
          'date',
          'price',
          'arrival_time',
          'is_served',
          "order_number",
          this.knex.raw('"service"::text[]'),
        )
        .from('puppy_requests')
        .where('id', id);

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  // delete on by id
  deleteOne = async (id: number): Promise<any> => {
    try {
      const data = await this.knex
        .delete()
        .from('puppy_requests')
        .where('id', id);

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  //edit
  editOne = async (id: number, dataToUpdate: any): Promise<any> => {
    try {
      const data = await this.knex('puppy_requests')
        .where('id', id)
        .update(dataToUpdate);

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  createOne = async (dataToUpdate: any): Promise<any> => {
    try {
      const data = await this.knex('puppy_requests')
        .insert(dataToUpdate)
        .returning('*');

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  //search by first name, last name, dog name
  search = async (query: string): Promise<any> => {
    try {
      const data = await this.knex
        .select(
          'id',
          'first_name',
          'last_name',
          'dog_name',
          'date',
          'price',
          'arrival_time',
          'is_served',
          this.knex.raw('"service"::text[]'),
        )
        .from('puppy_requests')
        .where('first_name', 'ilike', `%${query}%`)
        .orWhere('last_name', 'ilike', `%${query}%`)
        .orWhere('dog_name', 'ilike', `%${query}%`);

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  async updateOrder(idOrderMap: { id: number, order: number }[]) {

    try {

    const caseStatements = idOrderMap
      .map((req) => `WHEN id = ${req.id} THEN ${req.order}`)
      .join('\n');

    const ids = idOrderMap.map((req) => req.id).join(',');

    const query = this.knex.raw(`
      UPDATE puppy_requests
      SET order_number = CASE
        ${caseStatements}
        ELSE order_number
      END
      WHERE id IN (${ids})
    `);

      const data = await query;
      return data;
    } catch (error) {
      console.error(error);
    }
  }
}
