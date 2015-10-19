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

var _momentRange = require('moment-range');

var _momentRange2 = _interopRequireDefault(_momentRange);

var _lodashObjectExtend = require('lodash/object/extend');

var _lodashObjectExtend2 = _interopRequireDefault(_lodashObjectExtend);

var _dataLayout = require('./data/layout');

var _dataLayout2 = _interopRequireDefault(_dataLayout);

var _day = require('./day');

var _day2 = _interopRequireDefault(_day);

var _label = require('./label');

var _label2 = _interopRequireDefault(_label);

var _xLabels = require('./x-labels');

var _xLabels2 = _interopRequireDefault(_xLabels);

var _yLabels = require('./y-labels');

var _yLabels2 = _interopRequireDefault(_yLabels);

var _dataEventsCollection = require('./data/events-collection');

var _dataEventsCollection2 = _interopRequireDefault(_dataEventsCollection);

var Dayz = (function (_React$Component) {
    _inherits(Dayz, _React$Component);

    _createClass(Dayz, null, [{
        key: 'EventsCollection',
        value: _dataEventsCollection2['default'],
        enumerable: true
    }, {
        key: 'propTypes',
        value: {
            display: _react2['default'].PropTypes.oneOf(['month', 'week', 'day']),
            date: _react2['default'].PropTypes.object.isRequired,
            dayComponent: _react2['default'].PropTypes.func,
            events: _react2['default'].PropTypes.instanceOf(_dataEventsCollection2['default']),
            dayLabelComponent: _react2['default'].PropTypes.func,
            onDayClick: _react2['default'].PropTypes.func,
            onEventClick: _react2['default'].PropTypes.func
        },
        enumerable: true
    }, {
        key: 'defaultProps',
        value: {
            dayLabelComponent: _label2['default'],
            dayComponent: _day2['default'],
            display: 'month'
        },
        enumerable: true
    }]);

    function Dayz(props) {
        _classCallCheck(this, Dayz);

        _get(Object.getPrototypeOf(Dayz.prototype), 'constructor', this).call(this, props);
    }

    _createClass(Dayz, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.calculateLayout(this.props);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.calculateLayout(nextProps);
        }
    }, {
        key: 'calculateLayout',
        value: function calculateLayout(props) {
            var range = _moment2['default'].range(props.date.clone().startOf(props.display), props.date.clone().endOf(props.display));
            if (props.display === 'month') {
                range.start.subtract(range.start.weekday(), 'days');
                range.end.add(6 - range.end.weekday(), 'days');
            }
            var layout = new _dataLayout2['default'](props.events, range, { display: props.display, date: props.date });
            this.setState({ range: range, layout: layout });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            var Day = this.props.dayComponent;
            var classes = ["dayz", this.props.display];
            var days = [];

            this.state.range.by('days', function (day) {
                return days.push(_react2['default'].createElement(Day, { key: day.format('YYYYMMDD'), day: day, layout: _this.state.layout,
                    onClick: _this.props.onDayClick, onEventClick: _this.props.onEventClick,
                    labelComponent: _this.props.dayLabelComponent }));
            });

            return _react2['default'].createElement(
                'div',
                { className: classes.join(' ') },
                _react2['default'].createElement(_xLabels2['default'], { date: this.props.date, display: this.props.display }),
                _react2['default'].createElement(_yLabels2['default'], { date: this.props.date, display: this.props.display }),
                _react2['default'].createElement(
                    'div',
                    { className: 'days' },
                    days
                )
            );
        }
    }]);

    return Dayz;
})(_react2['default'].Component);

exports['default'] = Dayz;
module.exports = exports['default'];