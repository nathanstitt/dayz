'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _layout = require('./data/layout');

var _layout2 = _interopRequireDefault(_layout);

var _day = require('./day');

var _day2 = _interopRequireDefault(_day);

var _xLabels = require('./x-labels');

var _xLabels2 = _interopRequireDefault(_xLabels);

var _yLabels = require('./y-labels');

var _yLabels2 = _interopRequireDefault(_yLabels);

var _eventsCollection = require('./data/events-collection');

var _eventsCollection2 = _interopRequireDefault(_eventsCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('moment-range'); // needed in order to for range to install itself

var Dayz = _react2.default.createClass({
    displayName: 'Dayz',

    propTypes: {
        editComponent: _react2.default.PropTypes.func,
        display: _react2.default.PropTypes.oneOf(['month', 'week', 'day']),
        date: _react2.default.PropTypes.object.isRequired,
        displayHours: _react2.default.PropTypes.array,
        events: _react2.default.PropTypes.instanceOf(_eventsCollection2.default),
        onDayClick: _react2.default.PropTypes.func,
        onDayDoubleClick: _react2.default.PropTypes.func,
        onEventClick: _react2.default.PropTypes.func,
        onEventResize: _react2.default.PropTypes.func
    },

    getDefaultProps: function getDefaultProps() {
        return {
            display: 'month'
        };
    },
    componentWillMount: function componentWillMount() {
        this.calculateLayout(this.props);
    },
    componentWillUnmount: function componentWillUnmount() {
        this.detachEventBindings();
    },
    detachEventBindings: function detachEventBindings() {
        if (this.props.events) {
            this.props.events.off('change', this.onEventAdd);
        }
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this.calculateLayout(nextProps);
    },
    onEventsChange: function onEventsChange() {
        this.calculateLayout(this.props);
    },
    calculateLayout: function calculateLayout(props) {
        var range = _moment2.default.range(props.date.clone().startOf(props.display), props.date.clone().endOf(props.display));
        if (props.events) {
            this.detachEventBindings();
            props.events.on('change', this.onEventsChange, this);
        }
        if (props.display === 'month') {
            range.start.subtract(range.start.weekday(), 'days');
            range.end.add(6 - range.end.weekday(), 'days');
        }

        var layout = new _layout2.default(_extends({}, props, { range: range }));

        this.setState({ range: range, layout: layout });
    },
    render: function render() {
        var _this = this;

        var classes = ["dayz", this.props.display];
        var days = [];
        this.state.range.by('days', function (day) {
            return days.push(_react2.default.createElement(_day2.default, { key: day.format('YYYYMMDD'),
                day: day,
                position: days.length,
                layout: _this.state.layout,
                editComponent: _this.props.editComponent,
                onClick: _this.props.onDayClick,
                onDoubleClick: _this.props.onDayDoubleClick,
                onEventClick: _this.props.onEventClick,
                onEventResize: _this.props.onEventResize

            }));
        });
        return _react2.default.createElement(
            'div',
            { className: classes.join(' ') },
            _react2.default.createElement(_xLabels2.default, { date: this.props.date, display: this.props.display }),
            _react2.default.createElement(
                'div',
                { className: 'body' },
                _react2.default.createElement(_yLabels2.default, {
                    layout: this.state.layout,
                    display: this.props.display,
                    date: this.props.date
                }),
                _react2.default.createElement(
                    'div',
                    { className: 'days' },
                    days,
                    this.props.children
                )
            )
        );
    }
});

Dayz.EventsCollection = _eventsCollection2.default;

module.exports = Dayz;