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
                    maxOneTimeEventCount: 10,
                    maxRemotePagesCount: 2
                },
                loadedPages: 0,
                isViewLoaded: false,
                recurringEvents: [],
                oneTimeEvents: []
            }
        },
        computed: {
            viewCalendar: function () {
                return this.views.calendar;
            },
            isCalendarLoaded: function () {
                return this.calendar.loadedPages === this.calendar.config.maxRemotePagesCount;
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
                this.switchView(
                    null, window.location.hash.replace('#', '')
                );
            },
            loadCalendarEvents: function () {
                this.calendar.recurringEvents = events.recurringEvents;
                //this.fetchLocalCalendarEvents();
                this.calendar.oneTimeEvents = [];
                this.fetchRemoteCalendarEvents();
                this.calendar.isViewLoaded = true;
            },
            fetchLocalCalendarEvents: function () {
                this.calendar.oneTimeEvents = [];
                events.oneTimeEvents.forEach(function (event) {
                    let date = moment(event.date, 'DD.MM.YYYY [um] HH:mm [Uhr]');
                    if (date.isAfter() || date.isSame(moment(), "day"))
                        app.calendar.oneTimeEvents.push(event);
                });
            },
            fetchRemoteCalendarEvents: function (page) {
                if (page === undefined) page = 1;
                if (page < app.calendar.config.maxRemotePagesCount)
                    app.fetchRemoteCalendarEvents(page + 1);
                $.post('https://cors-anywhere.herokuapp.com/' + 'https://www.ev-jugend-hamm.de/wp-admin/admin-ajax.php',
                    {
                        action: 'tribe_list',
                        tribe_paged: page,
                        tribe_event_display: 'list',
                        featured: false
                    }, function (data) {
                        var events = [];
                        $("div.type-tribe_events", data.html).each(function (i, article) {
                            if ($(article).find("div.tribe-events-venue-details").text().trim().startsWith("Jugendkirche Hamm")) {

                                var dateRaw = $(article).find("span.tribe-event-date-start").text().split("@");
                                var date = moment(dateRaw[0] + " " + dateRaw[1], "MMMM DD HH:mm");
                                if (date.isBefore()) date.add(1, 'years');
                                var dateString = date.get('hours') === 0 ? date.format('DD.MM.YYYY') : date.format('DD.MM.YYYY [um] HH:mm [Uhr]');

                                var image = $(article).find("img").attr('src');
                                if (image.toLowerCase().includes("jugendkirche_logo")) image = null;

                                events.push({
                                    image: image,
                                    title: $(article).find("a.tribe-event-url").text(),
                                    date: dateString,
                                    timestamp: date.unix()
                                });
                            }
                        });
                        app.calendar.oneTimeEvents = app.calendar.oneTimeEvents.concat(events);
                        app.calendar.oneTimeEvents = app.calendar.oneTimeEvents.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1);
                        app.calendar.oneTimeEvents = app.calendar.oneTimeEvents.slice(0, app.calendar.config.maxOneTimeEventCount);
                        app.calendar.loadedPages += 1;
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
                if (viewCalendar && !this.calendar.isViewLoaded) {
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