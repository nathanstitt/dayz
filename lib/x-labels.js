'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodashCollectionMap = require('lodash/collection/map');

var _lodashCollectionMap2 = _interopRequireDefault(_lodashCollectionMap);

var XLabels = _react2['default'].createClass({
    displayName: 'XLabels',

    propTypes: {
        display: _react2['default'].PropTypes.oneOf(['month', 'week', 'day']),
        date: _react2['default'].PropTypes.object.isRequired
    },

    render: function render() {
        var days = [];
        if (this.props.display == 'day') {
            days.push(this.props.date);
        } else {
            var day = this.props.date.clone().startOf('week');
            for (var i = 0; i < 7; i++) {
                days.push(day.clone().add(i, 'day'));
            }
        }
        var format = this.props.display == 'month' ? 'dddd' : 'ddd, MMM Do';
        var labels = (0, _lodashCollectionMap2['default'])(days, function (day) {
            return _react2['default'].createElement(
                'div',
                { key: day.format('YYYYMMDD'), className: 'day-label' },
                day.format(format)
            );
        });

        return _react2['default'].createElement(
            'div',
            { className: 'x-labels' },
            labels
        );
    }

});

exports['default'] = XLabels;
module.exports = exports['default'];