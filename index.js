var koa = require('koa')
    ,error = require('koa-error')
    ,config = require('./config.js')
    ,koaLogger = require('koa-logger')
    ,logger = require('./logger.js')
    ,send = require('koa-send')
    ,mount = require('koa-mount');


if (require.main === module) {
    koa().use(error())
    .use(koaLogger(logger, {
        // which level you want to use for logging?
        // default is info
        level: 'info',
        // this is optional. Here you can provide request time in ms,
        // and all requests longer than specified time will have level 'warn'
        timeLimit: 100
    }))
    .use(mount('/api/app', require('./app.js').app))
    .use(function *() {
        yield send(this, this.path == '/'? '/index.html': this.path, {
            root: __dirname + '/frontend'
        });
    })
    .listen(config.get('port'));
}
