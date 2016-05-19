var koa = require('koa')
    ,json = require('koa-json')
    ,models = require('./models.js')
    ,casing = require('casing')
    ,router = require('koa-router')()
    ,koaBody = require('koa-body')();

router.post('/object/', koaBody, function *(next) {
    try {
        var item = yield models.Version.forge(casing.snakeize(
            Object.assign({
                createdAt: new Date,
            }, this.request.body))).save();
        this.body = item;
    } catch (err) {
        if (err.code == 'SQLITE_CONSTRAINT') {
           this.body = {
               name: "已经存在重复版本",
           } ;
           this.status = 403;
        }
    }
    yield next;
}).delete('/object/:id', function *(next) {
    yield models.Version.forge({ id: this.params.id }).destroy();
    this.body = {};
    yield next;
});

exports.app = koa().use(json()).use(router.routes()).use(router.allowedMethods());
