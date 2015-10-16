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

var _lodashCollectionMap = require('lodash/collection/map');

var _lodashCollectionMap2 = _interopRequireDefault(_lodashCollectionMap);

var _lodashObjectExtend = require('lodash/object/extend');

var _lodashObjectExtend2 = _interopRequireDefault(_lodashObjectExtend);

var _layout = require('./layout');

var _layout2 = _interopRequireDefault(_layout);

var _eventsCollection = require('./events-collection');

var _eventsCollection2 = _interopRequireDefault(_eventsCollection);

var _reactMomentProptypes = require('react-moment-proptypes');

var _reactMomentProptypes2 = _interopRequireDefault(_reactMomentProptypes);

var Dayz = (function (_React$Component) {
    _inherits(Dayz, _React$Component);

    _createClass(Dayz, null, [{
        key: 'EventsCollection',
        value: _eventsCollection2['default'],
        enumerable: true
    }, {
        key: 'propTypes',
        value: {
            display: _react2['default'].PropTypes.oneOf(['month', 'week', 'day']),
            date: _react2['default'].PropTypes.object.isRequired,
            dayComponent: _react2['default'].PropTypes.func,
            dayLabelComponent: _react2['default'].PropTypes.func,
            events: _react2['default'].PropTypes.instanceOf(_eventsCollection2['default'])
        },
        enumerable: true
    }, {
        key: 'defaultProps',
        value: {
            display: 'month',
            dayLabelComponent: function dayLabelComponent(props) {
                return _react2['default'].createElement(
                    'span',
                    { className: props.className },
                    props.children
                );
            },
            dayComponent: function dayComponent(props) {
                return _react2['default'].createElement(
                    'div',
                    { className: props.className },
                    props.children
                );
            }
        },
        enumerable: true
    }]);

    function Dayz(props) {
        _classCallCheck(this, Dayz);

        _get(Object.getPrototypeOf(Dayz.prototype), 'constructor', this).call(this, props);
    }

    _createClass(Dayz, [{
        key: 'renderEvent',
        value: function renderEvent(layout) {
            var classes = ['event', 'span-' + layout.span];
            if (layout.startsBefore) classes.push('is-continuation');
            if (layout.endsAfter) classes.push('is-continued');
            if (layout.stack) classes.push('stack-' + layout.stack);
            var state = {};
            var range = layout.event.range();
            if (!layout.event.isMultiDay()) {
                classes.push('hour-' + range.start.hour());
                classes.push('duration-' + range.diff('hours'));
            }
            return _react2['default'].createElement(
                'div',
                { key: layout.event.key, className: classes.join(' ') },
                layout.event.render()
            );
        }
    }, {
        key: 'renderDay',
        value: function renderDay(day) {
            var Day = this.props.dayComponent;
            var Label = this.props.dayLabelComponent;
            var classes = ['day'];

            if (this.state.layout.isDateOutsideRange(day)) {
                classes.push('outside');
            }
            return _react2['default'].createElement(
                Day,
                { className: classes.join(' '), key: day.format('YYYYMMDD') },
                _react2['default'].createElement(
                    Label,
                    { className: 'label' },
                    day.format('D')
                ),
                (0, _lodashCollectionMap2['default'])(this.state.layout.forDay(day), this.renderEvent, this, day)
            );
        }
    }, {
        key: 'renderYLabel',
        value: function renderYLabel(day) {
            var label = this.props.display == 'month' ? day.format('dddd') : day.format('ddd, MMM Do');
            return _react2['default'].createElement(
                'div',
                { key: day.format('YYYYMMDD'), className: 'label' },
                label
            );
        }
    }, {
        key: 'renderLabels',
        value: function renderLabels() {
            var xlabels = [];
            var ylabels = [];
            if (this.props.display == 'day') {
                xlabels.push(this.renderYLabel(this.props.date));
            } else {
                var day = this.state.layout.range.start.clone();
                for (var i = 0; i < 7; i++) {
                    xlabels.push(this.renderYLabel(day));
                    day.add(1, 'day');
                }
            }
            if (this.props.display != 'month') {
                var start = (0, _moment2['default'])().startOf('day');
                for (var hour = 0; hour < 24; hour++) {
                    start.add(1, 'hour');
                    ylabels.push(_react2['default'].createElement(
                        'div',
                        { className: 'hour' },
                        start.format('ha')
                    ));
                }
            }
            return { xlabels: xlabels, ylabels: ylabels };
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            var classes = ["dayz", this.props.display];
            var days = [];

            var _renderLabels = this.renderLabels();

            var xlabels = _renderLabels.xlabels;
            var ylabels = _renderLabels.ylabels;

            this.state.range.by('days', function (day) {
                return days.push(_this.renderDay(day));
            });

            return _react2['default'].createElement(
                'div',
                { className: classes.join(' ') },
                _react2['default'].createElement(
                    'div',
                    { className: 'x-labels' },
                    xlabels
                ),
                _react2['default'].createElement(
                    'div',
                    { className: 'y-labels' },
                    ylabels
                ),
                _react2['default'].createElement(
                    'div',
                    { className: 'days' },
                    days
                )
            );
        }
    }, {
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
            var range = new _momentRange2['default'](props.date.clone().startOf(props.display), props.date.clone().endOf(props.display));

            if (props.display === 'month') {
                range.start.subtract(range.start.weekday(), 'days');
                range.end.add(6 - range.end.weekday(), 'days');
            }

            var layout = new _layout2['default'](props.events, range, { display: props.display, date: props.date });

            this.setState({ range: range, layout: layout });
        }
    }]);

    return Dayz;
})(_react2['default'].Component);

exports['default'] = Dayz;
module.exports = exports['default'];