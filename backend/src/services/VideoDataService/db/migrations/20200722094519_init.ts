import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Video table
  // id          - Video ID
  // author_id   - Parent author ID
  // channel_id  - Parent channel ID
  // content_id  - Child content ID
  // description - Video description (1024 char max)
  // title       - Video title (32 char max)
  await knex.schema.createTable('video', (table) => {
    table
      .bigInteger('id')
      .unsigned()
      .notNullable();
    table
      .bigInteger('author_id')
      .unsigned()
      .notNullable();
    table.bigInteger('content_id').unsigned();
    table.string('description', 1024).notNullable();
    table.string('title', 32).notNullable();
    table.primary(['id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('video');
}
