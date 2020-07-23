import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Content table
  // id         - Content ID
  // assetID    - Asset ID from Mux
  // playbackID - Playback ID from Mux
  // duration   - Video duration in seconds
  await knex.schema.createTable('content', (table) => {
    table
      .bigInteger('id')
      .unsigned()
      .notNullable();
    table.string('asset_id', 64).notNullable();
    table.string('playback_id', 64).notNullable();
    table
      .float('duration')
      .unsigned()
      .notNullable();
    table.primary(['id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('content');
}
