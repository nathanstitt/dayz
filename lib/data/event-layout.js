'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _momentRange = require('moment-range');

var _momentRange2 = _interopRequireDefault(_momentRange);

var EventLayout = function EventLayout(event, displayRange) {
    _classCallCheck(this, EventLayout);

    this.event = event;
    this.startsBefore = event.start().isBefore(displayRange.start);
    this.endsAfter = event.end().isAfter(displayRange.end);

    this.span = _moment2['default'].min(displayRange.end, event.end()).diff(displayRange.start, 'day') + 1;
};

exports['default'] = EventLayout;
module.exports = exports['default'];