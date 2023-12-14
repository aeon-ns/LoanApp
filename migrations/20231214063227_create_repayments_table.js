// migrations/20220101130000_create_repayments_table.js

exports.up = function (knex) {
    return knex.schema.createTable('repayments', function (table) {
        table.increments('id').primary();
        table.integer('loan_id').unsigned().notNullable();
        table.foreign('loan_id').references('id').inTable('loans');
        table.decimal('amount', 10, 2).notNullable();
        table.enum('state', ['PENDING', 'APPROVED', 'PAID']).defaultTo('PENDING');
        table.date('due_date').notNullable(); // Add due_date column
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('repayments');
};
