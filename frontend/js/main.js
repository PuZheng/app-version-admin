var App = function () {
    this.name = m.prop("");
    this.brief = m.prop("");
};

var newAppForm = {
    controller: function (args) {
        this.init = function () {
            this.app = new App();
            this.errors = m.prop({});
            this.loading = m.prop();
        };
        this.init.apply(this);
        this.save = function () {
            this.loading(true);
            m.request({ 
                method: 'POST',
                url: '/api/app',
                data: this.app,
            }).then((data) => {
                toastr.options.positionClass = "toast-bottom-center";
                toastr.options.timeOut = 1000;
                toastr.success('创建成功!');
                this.init.apply(this);
                args.onsave(data);
            }, this.errors).then(() => {
                this.loading('');
            }).bind(this);
            return false;
        }.bind(this);
    },
    view: function (ctrl, args) {
        return m('.ui.centered.grid', [
            m('.ui.segment.eight.wide.column', [
                m('form.ui.form', {
                    onsubmit: ctrl.save,
                    class: ctrl.loading()? 'loading': '',
                }, [
                    m('h3', '创建APP'),
                    m(".field", [
                        m('label[for="input-name"]', "APP名称"),
                        m('input#input-name[type="text"][name="name"][placeholder="请输入APP名称"]', {
                            oninput: m.withAttr('value', ctrl.app.name),
                            value: ctrl.app.name(),
                        }),
                        m('.ui.pointing.red.basic.label', {
                            class: ctrl.errors().name? "": "invisible",
                        }, ctrl.errors().name || ""),
                    ]),
                    m('.field', [
                        m('label[for="input-brief"]', 'APP简介'),
                        m('textarea#input-brief[placeholder="请输入简介"]', {
                            oninput: m.withAttr('value', ctrl.app.brief),
                            value: ctrl.app.brief(),
                        })
                    ]),
                    m('input.ui.button.primary[type=submit][value="提交"]', {})
                ])
            ])
        ]);
    }
};

var appGrid = {
    view: function (ctrl, args) {
        return (
            m('.ui.grid', [
                m('.ui.column', [
                    m('.ui.segment', { 
                        onclick: function () {
                            // goto detail of application
                        } 
                    }, [
                        m('.ui.cards', args.apps().map(function (app) {
                            return m('.ui.card', [
                                m('.content', [
                                    m('.header', app.name),
                                    m('.meta', app.createdAt),
                                    m('.description', app.brief)
                                ])
                            ]);
                        }))
                    ])
                ])
            ])
        );
    }
};

m.mount($('.container')[0], {
    controller: function () {
        this.apps = m.request({
            method: 'GET',
            url: '/api/app/list',
            deserialize: (data) => {
                return JSON.parse(data).data; 
            }
        });
        this.onsave = function (app) {
            this.apps([app].concat(this.apps()));
        }.bind(this);
    },
    view: function (ctrl) {
        return [
            m.component(newAppForm, {
                onsave: ctrl.onsave,
            }),
            m.component(appGrid, {
                apps: ctrl.apps,
            })
        ];
    }
}, newAppForm);
