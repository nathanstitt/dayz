'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assign = require('lodash/object/assign');
var each = require('lodash/collection/each');
var moment = require('moment');
var EventLayout = require('./event-layout');
var C = require('./constants');

function cacheKey(day) {
    return day.format('YYYYMMDD');
}

// a layout describes how the calendar is displayed.

var Layout = (function () {
    function Layout(options) {
        var _this = this;

        _classCallCheck(this, Layout);

        assign(this, options);
        this.cache = Object.create(null);

        var multiDayCount = 0;
        var cacheMethod = 'day' === this.display ? 'addtoDaysCache' : 'calculateSpanningLayout';
        if (!this.events) {
            return;
        }
        var range = this.range;

        this.events.each(function (event) {
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
            return 60 * (this.displayHours[1] - this.displayHours[0] + 1);
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
            this.range.by('days', function (day) {
                each(_this2.forDay(day), function (layout) {
                    range[0] = Math.min(layout.event.start().hour(), range[0]);
                    range[1] = Math.max(layout.event.end().hour(), range[1]);
                });
            });
            return range;
        }
    }, {
        key: 'getEventsForWeek',
        value: function getEventsForWeek(day) {
            day = day.clone();
            var weeklyEvents = [];
            for (var i = 0; i < 7; i++) {
                var layouts = this.forDay(day);
                if (layouts.length) {
                    this.cache[cacheKey(day)] = layouts;
                    each(layouts, function (layout) {
                        if (!layout.event.isSingleDay()) {
                            weeklyEvents.push(layout);
                        }
                    });
                }
                day.add(1, 'day');
            }
            return weeklyEvents;
        }
    }, {
        key: 'calculateStacking',
        value: function calculateStacking() {
            var firstOfWeek = this.range.start.clone().startOf('week');
            do {
                var weeklyEvents = this.getEventsForWeek(firstOfWeek);
                for (var i = 0; i < weeklyEvents.length; i++) {
                    var layout = weeklyEvents[i];

                    // loop through eacy layouts are before this one
                    for (var pi = i - 1; pi >= 0; pi--) {
                        var prevLayout = weeklyEvents[pi];
                        // if the previous layout starts on the same cell then we don't need
                        // to stack it to clear previous layouts
                        if (prevLayout.startsBefore && layout.startsBefore || prevLayout.event.start().isSame(layout.event.start(), 'd') || layout.startsBefore && prevLayout.startsOnWeek() || prevLayout.startsBefore && layout.startsOnWeek()) {
                            break;
                        } else {
                            layout.stack++;
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
            date = date.clone();
            var found = false;
            each(this.cache, function (key, layout) {
                if (layout.event === eventLayout.event) {
                    found = true;
                    return false;
                }
            });
            if (!found) {
                eventLayout.first = true;
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
})();

module.exports = Layout;