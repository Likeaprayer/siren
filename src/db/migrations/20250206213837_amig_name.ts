import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Create user_type table
  await knex.schema.createTable('user_type', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('name').notNullable();
    
    table.timestamps(true, true);
  });

  // Create users table
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('name');
    table.string('email').notNullable().unique().index();
    table.string('password').notNullable();
    table.uuid('user_type').references('id').inTable('user_type').onDelete('CASCADE');
    table.timestamp('created_At');
    
    table.timestamps(true, true);
  });
  
  // Create artists table
  await knex.schema.createTable('artists', (table) => {
    table.uuid('id').primary().notNullable();
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('stagename');
    table.string('gender');
    table.string('contact_email');
    table.string('contact_phone');
    table.jsonb('location');
    
    table.timestamps(true, true);
  });
  
  // Create event_type table
  await knex.schema.createTable('event_type', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('name').notNullable();
    table.string('description');
    table.string('desigination');
    
    table.timestamps(true, true);
  });
  
  // Create listing_intent table
  await knex.schema.createTable('listing_intent', (table) => {
    table.uuid('id').primary().notNullable();
    table.uuid('artist_id').references('id').inTable('artists').onDelete('CASCADE');
    table.uuid('lister_id').references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('start_date');
    table.timestamp('end_date');
    table.decimal('bid', 14, 2);
    table.decimal('counter_bid', 14, 2);
    table.string('currency');
    table.integer('capacity');
    table.jsonb('location');
    table.string('status');
    table.text('notes');
    table.uuid('event_type').references('id').inTable('event_type').onDelete('CASCADE');
    
    table.timestamps(true, true);
  });
  
  // Create listings table
  await knex.schema.createTable('listings', (table) => {
    table.uuid('id').primary().notNullable();
    table.uuid('artist_id').references('id').inTable('artists').onDelete('CASCADE');
    table.uuid('lister_id').references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('start_date');
    table.timestamp('end_date');
    table.string('status');
    table.integer('capacity');
    table.uuid('listing_intent_id').references('id').inTable('listing_intent').onDelete('CASCADE');
    
    table.timestamps(true, true);
  });
  
  // Create payment_intent table
  await knex.schema.createTable('payment_intent', (table) => {
    table.uuid('id').primary().notNullable();
    table.uuid('user_id').references('id').inTable('users');
    table.decimal('amount', 14, 2);
    table.string('currency');
    table.boolean('is_processed').defaultTo(false);
    table.uuid('listing_intent_id').references('id').inTable('listing_intent').onDelete('CASCADE');
    
    table.timestamps(true, true);
  });
  
  // Create payments table
  await knex.schema.createTable('payments', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('reference');
    table.jsonb('metadata');
    table.decimal('amount', 14, 2);
    table.string('currency');
    table.uuid('payment_intent_id').references('id').inTable('payment_intent').onDelete('CASCADE');
    
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop tables in reverse order to avoid foreign key constraint issues
  await knex.schema.dropTableIfExists('payments');
  await knex.schema.dropTableIfExists('payment_intent');
  await knex.schema.dropTableIfExists('listings');
  await knex.schema.dropTableIfExists('listing_intent');
  await knex.schema.dropTableIfExists('event_type');
  await knex.schema.dropTableIfExists('artists');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('user_type');
}