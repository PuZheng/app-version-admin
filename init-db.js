
module.exports = initDB;

var initDB = function (knex) {
    return knex.schema.createTable('Application', function (table) {
        table.increments();
        table.string('name').unique().notNullable();
        table.string('brief');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

if (require.main === module) {
    var knex = require('./knex.js');
    initDB(knex).then(function () {
        knex.destroy();
    });
}
