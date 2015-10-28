'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dataEventLayout = require('./data/event-layout');

var _dataEventLayout2 = _interopRequireDefault(_dataEventLayout);

var MINUTES_IN_DAY = 1440;

var Event = _react2['default'].createClass({
    displayName: 'Event',

    propTypes: {
        layout: _react2['default'].PropTypes.instanceOf(_dataEventLayout2['default']),
        onClick: _react2['default'].PropTypes.func
    },

    onClick: function onClick(ev) {
        if (!this.props.onClick) {
            return;
        }
        this.props.onClick(this.props.layout.event, ev.target);
        ev.stopPropagation();
    },

    render: function render() {
        var classes = ['event', 'span-' + this.props.layout.span];
        var style = {};
        if (this.props.layout.startsBefore) classes.push('is-continuation');
        if (this.props.layout.endsAfter) classes.push('is-continued');
        if (this.props.layout.stack) classes.push('stack-' + this.props.layout.stack);
        if (this.props.layout.event.isSingleDay()) {
            var _props$layout$event$daysMinuteRange = this.props.layout.event.daysMinuteRange();

            var start = _props$layout$event$daysMinuteRange.start;
            var end = _props$layout$event$daysMinuteRange.end;

            var _top = (start / MINUTES_IN_DAY * 100).toFixed(2) + '%';
            var bottom = (100 - end / MINUTES_IN_DAY * 100).toFixed(2) + '%';
            style = { top: _top, bottom: bottom };
        }
        return _react2['default'].createElement(
            'div',
            { onClick: this.onClick,
                key: this.props.layout.event.key,
                style: style,
                className: classes.join(' ')
            },
            this.props.layout.event.render()
        );
    }

});

exports['default'] = Event;
module.exports = exports['default'];