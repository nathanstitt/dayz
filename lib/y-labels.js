'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _dataLayout = require('./data/layout');

var _dataLayout2 = _interopRequireDefault(_dataLayout);

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

var _lodashCollectionMap = require('lodash/collection/map');

var _lodashCollectionMap2 = _interopRequireDefault(_lodashCollectionMap);

var YLabels = _react2['default'].createClass({
    displayName: 'YLabels',

    propTypes: {
        display: _react2['default'].PropTypes.oneOf(['month', 'week', 'day']),
        date: _react2['default'].PropTypes.object.isRequired,
        layout: _react2['default'].PropTypes.instanceOf(_dataLayout2['default']).isRequired
    },

    render: function render() {
        if (this.props.display == 'month') {
            return null;
        }

        var start = (0, _moment2['default'])().startOf('day');
        var labels = [];

        for (var hour = 0; hour < 24; hour++) {
            start.add(1, 'hour');
            labels.push(_react2['default'].createElement(
                'div',
                { key: start.format('ha'), className: 'hour' },
                start.format('ha')
            ));
        }
        var multiDay = _react2['default'].createElement(
            'div',
            this.props.layout.propsForAllDayEventContainer(),
            'All Day'
        );

        return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
                'div',
                { className: 'y-labels' },
                multiDay,
                labels
            )
        );
    }

});

exports['default'] = YLabels;
module.exports = exports['default'];