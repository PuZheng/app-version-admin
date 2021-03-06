var convict = require('convict');

var conf = convict({
    env: {
        doc: "The applicaton environment.",
        format: ["production", "development", "test"],
        default: "development",
        env: "NODE_ENV"
    },
    port: {
        doc: 'listening port',
        format: 'port',
        default: 5000,
        env: 'PORT'
    },
    knexOpts: {
        doc: "options for knex",
        format: function () {

        },
        default: {
            client: 'sqlite3',
            connection: {
                filename: './db',
            },
            debug: true
        },
        env: "KNEX_OPTS",
    },
    assetDir: {
        doc: 'where assets resides',
        format: String,
        default: 'assets',
        env: 'ASSET_DIR',
    },
    site: {
        doc: 'this website',
        format: 'url',
        default: 'http://127.0.0.1:5000',
        env: 'WEB_SITE'
    },
});

// Load environment dependent configuration
var env = conf.get('env');
env != 'development' && conf.loadFile('./config/' + env + '.json');

// Perform validation
conf.validate({strict: true});

module.exports = conf;
