'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _layout = require('./data/layout');

var _layout2 = _interopRequireDefault(_layout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var YLabels = _react2.default.createClass({
    displayName: 'YLabels',

    propTypes: {
        display: _react2.default.PropTypes.oneOf(['month', 'week', 'day']),
        date: _react2.default.PropTypes.object.isRequired,
        layout: _react2.default.PropTypes.instanceOf(_layout2.default).isRequired
    },

    render: function render() {
        if (this.props.display === 'month') {
            return null;
        }

        var day = (0, _moment2.default)();
        var labels = [];

        var _props$layout$display = _slicedToArray(this.props.layout.displayHours, 2);

        var start = _props$layout$display[0];
        var end = _props$layout$display[1];

        for (var hour = start; hour <= end; hour++) {
            day.hour(hour);
            labels.push(_react2.default.createElement(
                'div',
                { key: hour, className: 'hour' },
                day.format('ha')
            ));
        }
        var multiDay = _react2.default.createElement(
            'div',
            this.props.layout.propsForAllDayEventContainer(),
            'All Day'
        );

        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'div',
                { className: 'y-labels' },
                multiDay,
                labels
            )
        );
    }
});

exports.default = YLabels;