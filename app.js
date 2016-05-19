var koa = require('koa')
    ,router = require('koa-router')()
    ,json = require('koa-json')
    ,models = require('./models.js')
    ,casing = require('casing')
    ,logger = require('./logger.js')
    ,koaBody = require('koa-body')();

router.post('/object/', koaBody, function *(next) {
    if (!this.request.body.package.trim()) {
        this.body = {
            package: "包名称不能为空"
        };
        this.status = 403;
        yield next;
        return;
    }
    try {
        var item = yield models.Application.forge(casing.snakeize(Object.assign({
            createdAt: function (d) {
                return d.getFullYear() + '年' + d.getMonth() + '月' + d.getDay() + '日';
            }(new Date())
        }, this.request.body))).save();
        this.body = item;
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
    this.body = yield models.Application.forge({id: this.params.id}).fetch({
        withRelated: ['versions']
    });
    yield next;
});


exports.app = koa().use(json()).use(router.routes()).use(router.allowedMethods());
