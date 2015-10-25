'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

var Dayz = _react2['default'].createClass({
    displayName: 'Dayz',

    propTypes: {
        display: _react2['default'].PropTypes.oneOf(['month', 'week', 'day']),
        date: _react2['default'].PropTypes.object.isRequired,
        dayComponent: _react2['default'].PropTypes.func,
        events: _react2['default'].PropTypes.instanceOf(_dataEventsCollection2['default']),
        dayLabelComponent: _react2['default'].PropTypes.func,
        onDayClick: _react2['default'].PropTypes.func,
        onEventClick: _react2['default'].PropTypes.func
    },

    getDefaultProps: function getDefaultProps() {
        return {
            dayLabelComponent: _label2['default'],
            dayComponent: _day2['default'],
            display: 'month'
        };
    },

    componentWillMount: function componentWillMount() {
        this.calculateLayout(this.props);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this.calculateLayout(nextProps);
    },

    calculateLayout: function calculateLayout(props) {
        var range = _moment2['default'].range(props.date.clone().startOf(props.display), props.date.clone().endOf(props.display));
        if (props.display === 'month') {
            range.start.subtract(range.start.weekday(), 'days');
            range.end.add(6 - range.end.weekday(), 'days');
        }
        var layout = new _dataLayout2['default'](props.events, range, { display: props.display, date: props.date });
        this.setState({ range: range, layout: layout });
    },

    render: function render() {
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
            _react2['default'].createElement(
                'div',
                { className: 'body' },
                _react2['default'].createElement(_yLabels2['default'], { date: this.props.date, display: this.props.display }),
                _react2['default'].createElement(
                    'div',
                    { className: 'days' },
                    days
                )
            )
        );
    }

});

Dayz.EventsCollection = _dataEventsCollection2['default'];

exports['default'] = Dayz;
module.exports = exports['default'];