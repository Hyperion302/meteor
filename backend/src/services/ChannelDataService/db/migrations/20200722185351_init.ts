import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Channel table
  // id - Channel ID
  // name - Channel name (32 char max)
  // owner_id - Channel owner ID
  await knex.schema.createTable('channel', (table) => {
    table
      .bigInteger('id')
      .unsigned()
      .notNullable();
    table
      .bigInteger('owner_id')
      .unsigned()
      .notNullable();
    table.string('name', 32).notNullable();
    table.primary(['id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('channel');
}
