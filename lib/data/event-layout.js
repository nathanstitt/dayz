'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var EventLayout = (function () {
    function EventLayout(layout, event, displayRange) {
        _classCallCheck(this, EventLayout);

        this.layout = layout;
        this.event = event;
        this.stack = 0;
        this.displayRange = displayRange;
        this.startsBefore = event.start().isBefore(displayRange.start);
        this.endsAfter = event.end().isAfter(displayRange.end);
        var latest = _moment2['default'].min(displayRange.end, event.end());
        this.span = Math.max(1, Math.round(latest.diff(displayRange.start, 'day', true)));
    }

    _createClass(EventLayout, [{
        key: 'isEditing',
        value: function isEditing() {
            return this.first && this.event.isEditing();
        }
    }, {
        key: 'startsOnWeek',
        value: function startsOnWeek() {
            return 0 === this.event.start().day();
        }
    }, {
        key: 'adjustEventTime',
        value: function adjustEventTime(startOrEnd, position, height) {
            if (position < 0 || position > height) {
                return;
            }
            var time = this.event[startOrEnd]().startOf('day').add(this.layout.displayHours[0], 'hours').add(this.layout.minutesInDay() * (position / height), 'minutes');
            var step = this.event.get('resizable').step;
            if (step) {
                var rounded = Math.round(time.minute() / step) * step;
                time.minute(rounded).second(0);
            }
            this.event.emit('change');
        }
    }, {
        key: 'inlineStyles',
        value: function inlineStyles() {
            if (this.layout.displayingAs() === 'month' || !this.event.isSingleDay()) {
                return {};
            } else {
                var _event$daysMinuteRange = this.event.daysMinuteRange();

                var start = _event$daysMinuteRange.start;
                var end = _event$daysMinuteRange.end;

                start -= this.layout.displayHours[0] * 60;
                end -= this.layout.displayHours[0] * 60;
                var inday = this.layout.minutesInDay();
                var _top = (start / inday * 100).toFixed(2) + '%';
                var bottom = (100 - end / inday * 100).toFixed(2) + '%';
                return { top: _top, bottom: bottom };
            }
        }
    }, {
        key: 'isResizable',
        value: function isResizable() {
            return this.layout.displayingAs() !== 'month' && this.event.get('resizable');
        }
    }, {
        key: 'key',
        value: function key() {
            return this.displayRange.start.format('YYYYMMDD') + this.event.key;
        }
    }, {
        key: 'classNames',
        value: function classNames() {
            var classes = ['event', 'span-' + this.span, 'color-' + this.event.colorIndex()];

            if (this.startsBefore) classes.push('is-continuation');
            if (this.endsAfter) classes.push('is-continued');
            if (this.stack) classes.push('stack-' + this.stack);
            if (this.isEditing()) classes.push('is-editing');
            if (this.isResizable()) classes.push('is-resizable');

            return classes.join(' ');
        }
    }]);

    return EventLayout;
})();

exports['default'] = EventLayout;
module.exports = exports['default'];