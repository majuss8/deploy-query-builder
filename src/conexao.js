const knex = require('knex')({
    client: 'pg',
    connection: {
        user: 'postgres',
        host: 'localhost',
        database: 'bd_cubos',
        password: '123456',
        port: 5432
    }
});

module.exports = knex;