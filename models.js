var knex = require('./knex.js')
    ,bookshelf = require('bookshelf')(knex)
    ,casing = require('casing');

var Application = bookshelf.Model.extend({
    tableName: 'application',
    serialize: function () {
        return casing.camelize(bookshelf.Model.prototype.serialize.apply(this));
    },
});

module.exports = {
    Application: Application,
};
