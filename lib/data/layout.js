'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _assign = require('lodash/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _eventLayout = require('./event-layout');

var _eventLayout2 = _interopRequireDefault(_eventLayout);

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function cacheKey(day) {
    return day.format('YYYYMMDD');
}

var Layout = (function () {
    function Layout(options) {
        _classCallCheck(this, Layout);

        (0, _assign2.default)(this, options);
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
                this[cacheMethod](event);
                if (!event.isSingleDay()) {
                    multiDayCount += 1;
                }
            }
        }, this);
        this.multiDayCount = multiDayCount;
        this.calculateStacking();
        if (!this.isDisplayingAsMonth() && !this.displayHours) {
            this.displayHours = this.hourRange();
        } else {
            this.displayHours = [0, 24];
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
            var style = this.multiDayCount ? { flexBasis: this.multiDayCount * _constants2.default.eventHeight } : { display: 'none' };
            return { className: 'all-day', style: style };
        }
    }, {
        key: 'hourRange',
        value: function hourRange() {
            var day = this.range.start.clone();
            var range = [7, 19];
            for (var d = 0; d < 7; d++) {
                var layouts = this.forDay(day);
                for (var i = 0; i < layouts.length; i++) {
                    var layout = layouts[i];
                    if (!layout.event.isSingleDay()) {
                        continue;
                    }
                    range[0] = Math.min(layout.event.start().hour(), range[0]);
                    range[1] = Math.max(layout.event.end().hour(), range[1]);
                }
                day.add(1, 'day');
            }
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
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = layouts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var layout = _step.value;

                            if (layout.event.isSingleDay()) {
                                continue;
                            }
                            weeklyEvents.push(layout);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
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
            return this.isDisplayingAsMonth() && !this.range.contains(date);
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
            var layout = new _eventLayout2.default(this, event, this.range);
            this.addToCache(this.range.start, layout);
        }

        // other layouts must break at week boundaries, with indicators if they were/are continuing

    }, {
        key: 'calculateSpanningLayout',
        value: function calculateSpanningLayout(event) {
            var end = _moment2.default.min(this.range.end, event.range().end);
            var start = _moment2.default.max(this.range.start, event.range().start).clone();
            do {
                var range = _moment2.default.range(start, start.clone().endOf('week'));
                var layout = new _eventLayout2.default(this, event, range);
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
            outer_block: {
                for (var key in this.cache) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = this.cache[key][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var layout = _step2.value;

                            if (layout.event === eventLayout.event) {
                                found = true;
                                break outer_block;
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            }
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

exports.default = Layout;