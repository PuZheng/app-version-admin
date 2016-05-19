var koa = require('koa')
    ,router = require('koa-router')()
    ,json = require('koa-json')
    ,models = require('./models.js')
    ,casing = require('casing')
    ,logger = require('./logger.js')
    ,koaBody = require('koa-body')();

router.post('/object/', koaBody, function *(next) {
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
        this.body = yield models.Application.forge({id: item.id}).fetch();
    } catch (err) {
        if (err.code == 'SQLITE_CONSTRAINT') {
           this.body = {
               name: "已经存在同名应用",
           } ;
           this.status = 403;
        }
    }
    yield next;
}).get('/list', function *(next) {
    this.body = {
        data: yield models.Application.forge().orderBy("-id").fetchAll()
    };
    yield next;
}).get('/object/:id', function *(next) {
    this.body = yield models.Application.forge({id: this.params.id}).fetch();
    yield next;
});


exports.app = koa().use(json()).use(router.routes()).use(router.allowedMethods());
