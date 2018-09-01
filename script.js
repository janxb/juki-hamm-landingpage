$("document").ready(function () {
    const app = new Vue({
        el: '#app',
        data: {
            views: {
                main: true,
                whatsapp: false,
                calendar: false
            },
            calendar: {
                config: {
                    maxOneTimeEventCount: 5
                },
                isLoaded: false,
                recurringEvents: [],
                oneTimeEvents: []
            }
        },
        computed: {
            viewCalendar: function () {
                return this.views.calendar;
            }
        },
        methods: {
            switchView: function (event, view) {
                let viewHash = view;
                if (view === '') {
                    view = 'main';
                }

                if (this.views.hasOwnProperty(view)) {
                    for (let tmpView in this.views) {
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
            },
            loadCalendarEvents: function () {
                this.calendar.recurringEvents = events.recurringEvents;
                this.fetchLocalCalendarEvents();
                this.prepareCalendarEventIds();
                this.calendar.isLoaded = true;
            },
            fetchLocalCalendarEvents: function () {
                this.calendar.oneTimeEvents = [];
                events.oneTimeEvents.forEach(function (event) {
                    let date = moment(event.date, 'DD.MM.YYYY [um] HH:mm [Uhr]');
                    if (date.isAfter() || date.isSame(moment(), "day"))
                        app.calendar.oneTimeEvents.push(event);
                });
            },
            fetchRemoteCalendarEvents: function () {
                let events = this.calendar.oneTimeEvents = [];
                $.get('https://cors-anywhere.herokuapp.com/' + 'https://www.ev-jugend-hamm.de/category/jugendkirche/', function (data) {
                    $("article", data).each(function (i, article) {
                        events.push({
                            image: $(article).find("img").attr('src'),
                            title: $(article).find(".post-content .entry-title a").html()
                        });
                    });
                    app.calendar.oneTimeEvents = events.slice(0, app.calendar.config.maxOneTimeEventCount);
                    app.prepareCalendarEventIds();
                });
            },
            prepareCalendarEventIds: function () {
                this.calendar.oneTimeEvents.forEach(function (event) {
                    event.id = Math.random().toString(36).substr(2, 9);
                });
            }
        },
        watch: {
            viewCalendar: function (viewCalendar) {
                if (viewCalendar && !this.calendar.isLoaded) {
                    this.loadCalendarEvents();
                }
            }
        },
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