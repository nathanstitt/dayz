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

var MINUTES_IN_DAY = 1440;

var EventLayout = (function () {
    function EventLayout(layout, event, displayRange) {
        _classCallCheck(this, EventLayout);

        this.layout = layout;
        this.event = event;
        this.startsBefore = event.start().isBefore(displayRange.start);
        this.endsAfter = event.end().isAfter(displayRange.end);
        var latest = _moment2['default'].min(displayRange.end.clone(), event.end());
        this.span = Math.max(1, Math.round(latest.diff(displayRange.start, 'day', true)));
    }

    _createClass(EventLayout, [{
        key: 'isEditing',
        value: function isEditing() {
            return this.first && this.event.isEditing();
        }
    }, {
        key: 'inlineStyles',
        value: function inlineStyles() {
            if (this.layout.displayingAs() == 'month' || !this.event.isSingleDay()) {
                return {};
            } else {
                var _event$daysMinuteRange = this.event.daysMinuteRange();

                var start = _event$daysMinuteRange.start;
                var end = _event$daysMinuteRange.end;

                var _top = (start / MINUTES_IN_DAY * 100).toFixed(2) + '%';
                var bottom = (100 - end / MINUTES_IN_DAY * 100).toFixed(2) + '%';
                return { top: _top, bottom: bottom };
            }
        }
    }]);

    return EventLayout;
})();

exports['default'] = EventLayout;
module.exports = exports['default'];