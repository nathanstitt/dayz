'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _momentRange = require('moment-range');

var _momentRange2 = _interopRequireDefault(_momentRange);

var _eventLayout = require('./event-layout');

var _eventLayout2 = _interopRequireDefault(_eventLayout);

function cacheKey(day) {
    return day.format('YYYYMMDD');
}

var Layout = (function () {
    function Layout(events, range, options) {
        _classCallCheck(this, Layout);

        this.options = options;
        this.cache = Object.create(null);
        this.range = range;
        var cacheMethod = 'day' === options.display ? 'addtoDaysCache' : 'calculateSpanningLayout';
        // console.log("Events: " , events);
        if (!events) {
            return;
        }
        events.each(function (event) {

            // console.log('Range: ', `${range.start.toString()} : ${range.end.toString()}`);
            // console.log('Event: ', `${event.range().start.toString()} : ${event.range().end.toString()}`);
            // console.log( range.overlaps(event.range()) );

            // we only care about events that are in the range we were provided
            if (range.overlaps(event.range())) {
                this[cacheMethod](event);
            }
        }, this);

        this.calculateStacking();
    }

    _createClass(Layout, [{
        key: 'hourRangeForWeek',
        value: function hourRangeForWeek(firstDay) {
            var day = firstDay.clone();
            var range = [7, 19];
            for (var i = 0; i < 7; i++) {
                var layouts = this.forDay(day);
                for (var _i = 0; _i < layouts.length; _i++) {

                    range[0] = Math.min(layouts[_i].event.start().hour(), range[0]);
                    range[1] = Math.max(layouts[_i].event.end().hour(), range[1]);
                }
                day.add(1, 'day');
            }
            return range;
        }
    }, {
        key: 'calculateStacking',
        value: function calculateStacking() {
            var day = this.range.start.clone().startOf('week');
            do {
                var weeklyEvents = [];
                for (var i = 0; i < 7; i++) {
                    var layouts = this.forDay(day);
                    if (layouts.length) {
                        this.cache[cacheKey(day)] = layouts;
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = layouts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var layout = _step.value;

                                weeklyEvents.push(layout);
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator['return']) {
                                    _iterator['return']();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                    }
                    day.add(1, 'day');
                }

                for (var i = 0; i < weeklyEvents.length; i++) {
                    var layout = weeklyEvents[i];
                    layout.stack = 0;
                    // find out how many layouts are before this one
                    for (var pi = i - 1; pi >= 0; pi--) {
                        var se = weeklyEvents[pi];

                        if (se.event.range().start.isSame(layout.event.range().start, 'd')) {
                            layout.stack = 1; // the one right before this has the same day so we only stack one high
                            break;
                        } else {
                            layout.stack++;
                        }
                    }
                }

                // console.log('Range: ', `${day.toString()} : ${this.range.end.toString()}`);
            } while (!day.isAfter(this.range.end));
        }
    }, {
        key: 'isDateOutsideRange',
        value: function isDateOutsideRange(date) {
            return 'month' === this.options.display && !this.range.contains(date);
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
            // console.log(`${event.range().start.toString()} isBefore: ${startAt.toString()}`);
            var layout = new _eventLayout2['default'](event, this.range);
            this.addToCache(this.range.start, layout);
            // this.addToCache(this.range.start, { startsBefore: this.range.start.isAfter( event.range().start ),
            //                                     endsAfter: this.range.end.isBefore(event.range().end),
            //                                     event, span: 1 });
        }

        // other layouts must break at week boundaries, with indicators if they were/are continuing
    }, {
        key: 'calculateSpanningLayout',
        value: function calculateSpanningLayout(event) {

            var end = _moment2['default'].min(this.range.end, event.range().end);
            var start = _moment2['default'].max(this.range.start, event.range().start);

            do {
                var layout = new _eventLayout2['default'](event, _moment2['default'].range(start, start.clone().endOf('week')));

                this.addToCache(start, layout);

                // { startsBefore, endsAfter, event,
                //                          span: moment.min(endOfWeek, event.range().end).diff(start, 'day')+1

                // go to first day of next week
                start.add(7 - start.day(), 'day');
            } while (!start.isAfter(end));
        }
    }, {
        key: 'addToCache',
        value: function addToCache(date, attributes) {
            //console.log(`Added for date: ${date.toString()}`)
            var dayCache = this.cache[cacheKey(date)] || (this.cache[cacheKey(date)] = []);
            dayCache.push(attributes);
        }
    }]);

    return Layout;
})();

exports['default'] = Layout;
module.exports = exports['default'];