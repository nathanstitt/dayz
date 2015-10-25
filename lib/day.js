'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dataLayout = require('./data/layout');

var _dataLayout2 = _interopRequireDefault(_dataLayout);

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

var _lodashCollectionMap = require('lodash/collection/map');

var _lodashCollectionMap2 = _interopRequireDefault(_lodashCollectionMap);

var Day = _react2['default'].createClass({
    displayName: 'Day',

    propTypes: {
        labelComponent: _react2['default'].PropTypes.func,
        day: _react2['default'].PropTypes.object.isRequired,
        layout: _react2['default'].PropTypes.instanceOf(_dataLayout2['default']),
        onClick: _react2['default'].PropTypes.func,
        onEventClick: _react2['default'].PropTypes.func
    },

    onClick: function onClick(ev) {
        if (!this.props.onClick) {
            return;
        }
        var hours = 24 * ((ev.pageY - ev.target.offsetTop) / ev.target.offsetHeight);
        this.props.onClick(ev, this.props.day.clone().startOf('day').add(hours, 'hour'));
    },

    render: function render() {
        var _this = this;

        var Label = this.props.labelComponent;
        var classes = ['day'];

        if (this.props.layout.isDateOutsideRange(this.props.day)) {
            classes.push('outside');
        }

        var events = (0, _lodashCollectionMap2['default'])(this.props.layout.forDay(this.props.day), function (layout) {
            return _react2['default'].createElement(_event2['default'], {
                onClick: _this.props.onEventClick,
                key: layout.event.key,
                layout: layout, day: _this.props.day });
        });

        return _react2['default'].createElement(
            'div',
            { onClick: this.onClick,
                className: classes.join(' '),
                key: this.props.day.format('YYYYMMDD')
            },
            _react2['default'].createElement(
                Label,
                { day: this.props.day, className: 'label' },
                this.props.day.format('D')
            ),
            events
        );
    }

});

exports['default'] = Day;
module.exports = exports['default'];