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

var _dataLayout = require('./data/layout');

var _dataLayout2 = _interopRequireDefault(_dataLayout);

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

var _lodashCollectionMap = require('lodash/collection/map');

var _lodashCollectionMap2 = _interopRequireDefault(_lodashCollectionMap);

var Day = (function (_React$Component) {
    _inherits(Day, _React$Component);

    function Day() {
        _classCallCheck(this, Day);

        _get(Object.getPrototypeOf(Day.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Day, [{
        key: 'onClick',
        value: function onClick(ev) {
            if (!this.props.onClick) {
                return;
            }
            var hours = 24 * ((ev.pageY - ev.target.offsetTop) / ev.target.offsetHeight);
            this.props.onClick(ev, this.props.day.clone().startOf('day').add(hours, 'hour'));
        }
    }, {
        key: 'onEventClick',
        value: function onEventClick(ev) {
            if (!this.props.onEventClick) {
                return;
            }
            this.props.onEventClick(ev, this.props.layout);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            var Label = this.props.labelComponent;
            var classes = ['day'];

            if (this.props.layout.isDateOutsideRange(this.props.day)) {
                classes.push('outside');
            }

            var events = (0, _lodashCollectionMap2['default'])(this.props.layout.forDay(this.props.day), function (layout) {
                return _react2['default'].createElement(_event2['default'], {
                    onClick: function (e) {
                        return _this.onEventClick(e);
                    },
                    key: layout.event.key,
                    layout: layout, day: _this.props.day });
            });

            return _react2['default'].createElement(
                'div',
                { onClick: function (e) {
                        return _this.onClick(e);
                    },
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
    }], [{
        key: 'propTypes',
        value: {
            labelComponent: _react2['default'].PropTypes.func,
            day: _react2['default'].PropTypes.object.isRequired,
            layout: _react2['default'].PropTypes.instanceOf(_dataLayout2['default']),
            onClick: _react2['default'].PropTypes.func,
            onEventClick: _react2['default'].PropTypes.func
        },
        enumerable: true
    }]);

    return Day;
})(_react2['default'].Component);

exports['default'] = Day;
module.exports = exports['default'];