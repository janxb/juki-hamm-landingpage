$("document").ready(function () {
    var app = new Vue({
        el: '#app',
        data: {
            views: {
                main: true,
                whatsapp: false,
                calendar: false
            }
        },
        methods: {
            switchView: function (event, view) {
                if (this.views.hasOwnProperty(view)) {
                    for (var tmpView in this.views) {
                        if (this.views.hasOwnProperty(tmpView))
                            this.views[tmpView] = false;
                    }
                    this.views[view] = true;
                    window.location.hash = view;
                }
            },
            hashChanged: function () {
                if (window.location.hash) {
                    this.switchView(
                        null, window.location.hash.replace('#', '')
                    );
                }
            }
        },
        watch: {},
        mounted() {
            this.hashChanged();
        }
    });

    window.onhashchange = function (hash) {
        app.hashChanged();
    };
})
;