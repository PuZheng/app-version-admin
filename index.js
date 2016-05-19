var koa = require('koa')
    ,error = require('koa-error')
    ,config = require('./config.js')
    ,koaLogger = require('koa-logger')
    ,logger = require('./logger.js')
    ,send = require('koa-send')
    ,fs = require('mz/fs')
    ,path = require('path')
    ,parse = require('co-busboy')
    ,router = require('koa-router')()
    ,utils = require('./utils.js')
    ,mount = require('koa-mount');

router.post('/upload', function *(next) {
    var parts = parse(this), part, paths = [], username = "", orgCode = "";
    while ((part = yield parts)) {
        if (part.length) {
            switch (part[0]) {
                case 'username':
                    username = part[1];
                    break;
                case 'orgCode':
                    orgCode = part[1];
                    break;
                default:
                    break;
            }
        } else {
            // part is stream
            var dirPath = path.join(config.get('assetDir'), orgCode, username);
            yield utils.assertDir(dirPath);
            var stream = fs.createWriteStream(path.join(dirPath, part.filename));
            logger.info('uploading %s', stream.path);
            part.pipe(stream);
            paths.push(stream.path);
        }
    }
    this.body = {
        paths: paths,
    };
    yield next;
});

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
    .use(mount('/api/version', require('./version.js').app))
    .use(router.routes())
    .use(router.allowedMethods())
    .use(function *(next) {
        if (this.path.startsWith('/api/') || this.method != 'GET') {
            yield next;
            return;
        }
        var _path = this.path == '/'? '/index.html': this.path;
        try {
            yield fs.stat(path.join(__dirname, 'frontend', _path));
        } catch (err) {
            if (err.code == 'ENOENT') {
                _path = '/index.html';
            }
        }
        yield send(this, _path, {
            root: __dirname + '/frontend'
        });
    })
    .listen(config.get('port'));
}
