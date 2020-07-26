import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Adds the created_at column
  await knex.schema.alterTable('video', (table) => {
    table.dateTime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('video', (table) => {
    table.dropColumn('created_at');
  });
}
