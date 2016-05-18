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
            }).then(() => {
                toastr.options.positionClass = "toast-bottom-center";
                toastr.options.timeOut = 1000;
                toastr.success('创建成功!');
                this.init.apply(this);
            }, this.errors).then(() => {
                this.loading('');
            });
            return false;
        }.bind(this);
    },
    view: function (ctrl, args) {
        console.log(ctrl.loading);
        return m('.row', [
            m('form', {
                onsubmit: ctrl.save,
                class: ctrl.loading()? 'loading': '',
            }, [
                m('h3.twelve.columns', '创建APP'),
                m(".row", [
                    m('.twelve.columns', [
                        m('label[for="input-name"]', "APP名称"),
                        m('input#input-name.u-full-width[type="text"][name="name"][placeholder="请输入APP名称"]', {
                            oninput: m.withAttr('value', ctrl.app.name),
                            value: ctrl.app.name(),
                        }),
                        m('.error', {
                            class: ctrl.errors().name? "": "invisible",
                        }, ctrl.errors().name || "")
                    ]),
                    m('.twelve.columns', [
                        m('label[for="input-brief"]', 'APP简介'),
                        m('textarea#input-brief.u-full-width[placeholder="请输入简介"]', {
                            oninput: m.withAttr('value', ctrl.app.brief),
                            value: ctrl.app.brief(),
                        })
                    ]),
                    m('input.button-primary[type=submit][value="提交"]', {})
                ])
            ])
        ]);
    }
};

m.mount($('.container')[0], newAppForm);
