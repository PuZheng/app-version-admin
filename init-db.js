
module.exports = initDB;

var initDB = function (knex) {
    return knex.schema.createTable('application', function (table) {
        table.increments();
        table.string('package').unique().notNullable();
        table.string('brief');
        table.timestamp('created_at');
    }).createTable("version", function (table) {
        table.increments();
        table.integer('application_id').notNullable().references('application.id');
        table.string('version').notNullable();
        table.unique(['application_id', 'version']);
        table.string('brief');
        table.timestamp('created_at');
    });
};

if (require.main === module) {
    var knex = require('./knex.js');
    initDB(knex).then(function () {
        knex.destroy();
    });
}
