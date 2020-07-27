import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('video', (table) => {
    table
      .bigInteger('channel_id')
      .unsigned()
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('video', (table) => {
    table.dropColumn('channel_id');
  });
}
