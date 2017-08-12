var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import EventLayout from './event-layout';
import C from './constants';
import moment from '../moment-range';
import EventsCollection from './events-collection';

function cacheKey(day) {
    return day.format('YYYYMMDD');
}

// a layout describes how the calendar is displayed.

var Layout = function () {
    function Layout(options) {
        var _this = this;

        _classCallCheck(this, Layout);

        Object.assign(this, options);
        this.cache = Object.create(null);

        var multiDayCount = 0;
        var cacheMethod = 'day' === this.display ? 'addtoDaysCache' : 'calculateSpanningLayout';
        if (!this.events) {
            this.events = new EventsCollection();
        }
        var range = this.range;

        this.events.forEach(function (event) {
            // we only care about events that are in the range we were provided
            if (range.overlaps(event.range())) {
                _this[cacheMethod](event);
                if (!event.isSingleDay()) {
                    multiDayCount += 1;
                }
            }
        });
        this.multiDayCount = multiDayCount;
        this.calculateStacking();
        if (!this.isDisplayingAsMonth() && !this.displayHours) {
            this.displayHours = this.hourRange();
        } else {
            this.displayHours = this.displayHours || [0, 24];
        }
    }

    _createClass(Layout, [{
        key: 'minutesInDay',
        value: function minutesInDay() {
            return (this.displayHours[1] - this.displayHours[0]) * 60;
        }
    }, {
        key: 'propsForDayContainer',
        value: function propsForDayContainer(props) {
            var classes = ['day'];
            if (this.isDateOutsideRange(props.day)) {
                classes.push('outside');
            }
            return { className: classes.join(' '), style: { order: props.position } };
        }
    }, {
        key: 'propsForAllDayEventContainer',
        value: function propsForAllDayEventContainer() {
            var style = this.multiDayCount ? { flexBasis: this.multiDayCount * C.eventHeight } : { display: 'none' };
            return { className: 'all-day', style: style };
        }
    }, {
        key: 'hourRange',
        value: function hourRange() {
            var _this2 = this;

            var range = [7, 19];
            Array.from(this.range.by('days')).forEach(function (day) {
                _this2.forDay(day).forEach(function (layout) {
                    range[0] = Math.min(layout.event.start().hour(), range[0]);
                    range[1] = Math.max(layout.event.end().hour(), range[1]);
                });
            });
            range[1] += 1;
            return range;
        }
    }, {
        key: 'getEventsForWeek',
        value: function getEventsForWeek(start) {
            var day = start.clone();
            var weeklyEvents = [];
            for (var i = 0; i < 7; i++) {
                var layouts = this.forDay(day);
                for (var li = 0, length = layouts.length; li < length; li += 1) {
                    weeklyEvents.push(layouts[li]);
                }
                day.add(1, 'day');
            }
            var minLong = function minLong(range) {
                return moment.max(start, range.start).diff(moment.min(day, range.end), 'minutes');
            };
            return weeklyEvents.sort(function (al, bl) {
                var a = minLong(al.event.range());
                var b = minLong(bl.event.range());
                return a === b ? 0 : a > b ? 1 : -1; // eslint-disable-line no-nested-ternary
            });
        }
    }, {
        key: 'calculateStacking',
        value: function calculateStacking() {
            var firstOfWeek = this.range.start.clone().startOf('week');
            do {
                var weeklyEvents = this.getEventsForWeek(firstOfWeek);
                for (var layoutIndex = 0; layoutIndex < weeklyEvents.length; layoutIndex++) {
                    var layout = weeklyEvents[layoutIndex];
                    // loop through each layout that is before this one
                    var ceilingIndex = 0;
                    for (var pi = layoutIndex - 1; pi >= 0; pi--) {
                        var prevLayout = weeklyEvents[pi];
                        if (prevLayout.range.start.isSame(layout.range.start, 'd')) {
                            ceilingIndex = pi + 1;
                            break;
                        }
                    }
                    for (var _pi = ceilingIndex; _pi < layoutIndex; _pi++) {
                        var _prevLayout = weeklyEvents[_pi];
                        if (layout.range.overlaps(_prevLayout.range)) {
                            layout.stack += 1;
                        }
                    }
                }
                firstOfWeek.add(7, 'day');
            } while (!firstOfWeek.isAfter(this.range.end));
        }
    }, {
        key: 'isDateOutsideRange',
        value: function isDateOutsideRange(date) {
            return this.isDisplayingAsMonth() && this.date.month() !== date.month();
        }
    }, {
        key: 'forDay',
        value: function forDay(day) {
            return this.cache[cacheKey(day)] || [];
        }

        // a single day is easy, just add the event to that day

    }, {
        key: 'addtoDaysCache',
        value: function addtoDaysCache(event) {
            var layout = new EventLayout(this, event, this.range);
            this.addToCache(this.range.start, layout);
        }

        // other layouts must break at week boundaries, with indicators if they were/are continuing

    }, {
        key: 'calculateSpanningLayout',
        value: function calculateSpanningLayout(event) {
            var end = moment.min(this.range.end, event.range().end);
            var start = moment.max(this.range.start, event.range().start).clone();
            do {
                var range = moment.range(start, start.clone().endOf('week'));
                var layout = new EventLayout(this, event, range);
                this.addToCache(start, layout);
                // go to first day of next week
                start.add(7 - start.day(), 'day');
            } while (!start.isAfter(end));
        }
    }, {
        key: 'addToCache',
        value: function addToCache(date, eventLayout) {
            var found = false;
            for (var key in this.cache) {
                // eslint-disable-line no-restricted-syntax
                if (this.cache[key].event === eventLayout.event) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                eventLayout.first = true; // eslint-disable-line no-param-reassign
            }
            var dayCache = this.cache[cacheKey(date)] || (this.cache[cacheKey(date)] = []);
            dayCache.push(eventLayout);
        }
    }, {
        key: 'displayingAs',
        value: function displayingAs() {
            return this.display;
        }
    }, {
        key: 'isDisplayingAsMonth',
        value: function isDisplayingAsMonth() {
            return 'month' === this.display;
        }
    }]);

    return Layout;
}();

export default Layout;