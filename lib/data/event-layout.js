'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var moment = require('moment');

// an event layout describes how an event is displayed.
// A event may be split into one or more layouts in order to be split across week boundaries

var EventLayout = function () {
    function EventLayout(layout, event, displayRange) {
        _classCallCheck(this, EventLayout);

        this.layout = layout;
        this.event = event;
        this.stack = 0;
        this.displayRange = displayRange;
        this.startsBefore = event.start().isBefore(displayRange.start);
        this.endsAfter = event.end().isAfter(displayRange.end);
        this.range = moment.range(moment.max(displayRange.start, event.start()), moment.min(displayRange.end, event.end()));
        var latest = moment.min(displayRange.end, event.end());
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
                var _event$daysMinuteRang = this.event.daysMinuteRange(),
                    start = _event$daysMinuteRang.start,
                    end = _event$daysMinuteRang.end;

                var startOffset = this.layout.displayHours[0] * 60;
                start -= startOffset;
                end -= startOffset;
                var inday = this.layout.minutesInDay();
                var top = (start / inday * 100).toFixed(2) + '%';
                var bottom = (100 - end / inday * 100).toFixed(2) + '%';
                return { top: top, bottom: bottom };
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
        key: 'setIsResizing',
        value: function setIsResizing(val) {
            this.isResizing = val;
        }
    }, {
        key: 'classNames',
        value: function classNames() {
            var classes = ['event', 'span-' + this.span, 'color-' + this.event.colorIndex()];
            if (this.isResizing) classes.push('is-resizing');
            if (this.startsBefore) classes.push('is-continuation');
            if (this.endsAfter) classes.push('is-continued');
            if (this.stack) classes.push('stack-' + this.stack);
            if (this.isEditing()) classes.push('is-editing');
            if (this.isResizable()) classes.push('is-resizable');
            return classes.join(' ');
        }
    }]);

    return EventLayout;
}();

module.exports = EventLayout;