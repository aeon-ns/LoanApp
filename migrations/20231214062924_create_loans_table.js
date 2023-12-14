
exports.up = function (knex) {
    return knex.schema.createTable('loans', function (table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
        table.decimal('amount', 10, 2).notNullable();
        table.integer('term').notNullable();
        table.enum('state', ['PENDING', 'APPROVED', 'PAID']).defaultTo('PENDING');
        table.timestamps(true, true); // Adds created_at and updated_at columns
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('loans');
};
