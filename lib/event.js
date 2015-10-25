'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dataEvent = require('./data/event');

var _dataEvent2 = _interopRequireDefault(_dataEvent);

var Event = _react2['default'].createClass({
    displayName: 'Event',

    propTypes: {
        layout: _react2['default'].PropTypes.object.isRequired,
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
        if (this.props.layout.startsBefore) classes.push('is-continuation');
        if (this.props.layout.endsAfter) classes.push('is-continued');
        if (this.props.layout.stack) classes.push('stack-' + this.props.layout.stack);

        var range = this.props.layout.event.range();
        if (!this.props.layout.event.isMultiDay()) {
            classes.push('hour-' + range.start.hour());
            classes.push('duration-' + range.diff('hours'));
        }
        return _react2['default'].createElement(
            'div',
            { onClick: this.onClick,
                key: this.props.layout.event.key,
                className: classes.join(' ')
            },
            this.props.layout.event.render()
        );
    }

});

exports['default'] = Event;
module.exports = exports['default'];