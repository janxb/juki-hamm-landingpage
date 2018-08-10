$("document").ready(function () {
    var app = new Vue({
        el: '#app',
        data: {
            views: {
                main: true,
                whatsapp: false,
                calendar: false
            },
            calendar: {
                recurringEvents: [
                    {
                        title: "JuKi-Treff",
                        description: "Jeden Dienstag von 18-20 Uhr treffen wir uns in der Jugendkirche und planen die nächsten Gottesdienste und Aktionen. Komm vorbei, wir freuen uns immer über neue Gesichter!",
                        responsible: "Katrin Berger"
                    },
                    {
                        title: "Jugendtreff",
                        description: "Jeden Mittwoch von 16-18 Uhr sind wir für dich in der Jugendkirche. Hier kannst du chillen, quatschen oder andere coole Dinge machen. Komm gerne vorbei, es gibt keinen Haken!",
                        responsible: "Katrin Burghardt"
                    },
                    {
                        title: "Nachwuchs Musik und Technik",
                        description: "Du hast Lust im Jugendgottesdienst Musik zu machen, oder interessierst dich für Ton- und Lichttechnik? Dann bist du bei uns richtig! Wir sind jeden Donnerstag von 16-18 Uhr in der Jugendkirche und geben dir Raum zum Lernen und Ausprobieren.",
                        responsible: "Tobias Pälmke und Ulrike Egermann"
                    }
                ]
            }
        },
        methods: {
            switchView: function (event, view) {
                var viewHash = view;
                if (view === '') {
                    view = 'main';
                }

                if (this.views.hasOwnProperty(view)) {
                    for (var tmpView in this.views) {
                        if (this.views.hasOwnProperty(tmpView))
                            this.views[tmpView] = false;
                    }
                    this.views[view] = true;
                    window.location.hash = viewHash;
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
            if (!window.location.hash) {
                window.location.hash = 'dummy';
                window.location.hash = '';
            }
            this.hashChanged();
        }
    });

    window.onhashchange = function (hash) {
        app.hashChanged();
    };
})
;