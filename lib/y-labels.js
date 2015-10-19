'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var YLabels = (function (_React$Component) {
    _inherits(YLabels, _React$Component);

    function YLabels() {
        _classCallCheck(this, YLabels);

        _get(Object.getPrototypeOf(YLabels.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(YLabels, [{
        key: 'render',
        value: function render() {
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

            return _react2['default'].createElement(
                'div',
                { className: 'y-labels' },
                labels
            );
        }
    }], [{
        key: 'propTypes',
        value: {
            display: _react2['default'].PropTypes.oneOf(['month', 'week', 'day']),
            date: _react2['default'].PropTypes.object.isRequired
        },
        enumerable: true
    }]);

    return YLabels;
})(_react2['default'].Component);

exports['default'] = YLabels;
module.exports = exports['default'];