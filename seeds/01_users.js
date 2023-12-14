const bcrypt = require('bcrypt');

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('users')
        .del()
        .then(async function () {
            // Inserts seed entries
            return knex('users').insert([
                {
                    username: 'admin',
                    password: await bcrypt.hash('admin', 10),
                    role: 'ADMIN',
                },
                // Add one customer
                {
                    username: 'customer',
                    password: await bcrypt.hash('customer', 10),
                    role: 'USER',
                },
            ]);
        });
};
