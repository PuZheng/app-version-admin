var koa = require('koa')
    ,router = require('koa-router')()
    ,json = require('koa-json')
    ,models = require('./models.js')
    ,casing = require('casing')
    ,logger = require('./logger.js')
    ,koaBody = require('koa-body')();

router.post('/', koaBody, function *(next) {
    if (!this.request.body.name.trim()) {
        this.body = {
            name: "名称不能为空"
        };
        this.status = 403;
        yield next;
        return;
    }
    try {
        var item = yield models.Application.forge(casing.snakeize(this.request.body)).save();
        this.body = {};
    } catch (err) {
        if (err.code == 'SQLITE_CONSTRAINT') {
           this.body = {
               name: "已经存在同名应用",
           } ;
           this.status = 403;
        }
    }
    yield next;
});


exports.app = koa().use(json()).use(router.routes()).use(router.allowedMethods());
