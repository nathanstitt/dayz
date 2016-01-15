'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var moment = require('moment');
var Layout = require('./data/layout');
var Day = require('./day');
var XLabels = require('./x-labels');
var YLabels = require('./y-labels');

require('moment-range'); // needed in order to for range to install itself

var EventsCollection = require('./data/events-collection');

var Dayz = React.createClass({
    displayName: 'Dayz',

    propTypes: {
        editComponent: React.PropTypes.func,
        display: React.PropTypes.oneOf(['month', 'week', 'day']),
        date: React.PropTypes.object.isRequired,
        displayHours: React.PropTypes.array,
        events: React.PropTypes.instanceOf(EventsCollection),
        onDayClick: React.PropTypes.func,
        onDayDoubleClick: React.PropTypes.func,
        onEventClick: React.PropTypes.func,
        onEventResize: React.PropTypes.func
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
        var range = moment.range(props.date.clone().startOf(props.display), props.date.clone().endOf(props.display));
        if (props.events) {
            this.detachEventBindings();
            props.events.on('change', this.onEventsChange, this);
        }
        if (props.display === 'month') {
            range.start.subtract(range.start.weekday(), 'days');
            range.end.add(6 - range.end.weekday(), 'days');
        }

        var layout = new Layout(_extends({}, props, { range: range }));

        this.setState({ range: range, layout: layout });
    },
    render: function render() {
        var _this = this;

        var classes = ["dayz", this.props.display];
        var days = [];
        this.state.range.by('days', function (day) {
            return days.push(React.createElement(Day, { key: day.format('YYYYMMDD'),
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
        return React.createElement(
            'div',
            { className: classes.join(' ') },
            React.createElement(XLabels, { date: this.props.date, display: this.props.display }),
            React.createElement(
                'div',
                { className: 'body' },
                React.createElement(YLabels, {
                    layout: this.state.layout,
                    display: this.props.display,
                    date: this.props.date
                }),
                React.createElement(
                    'div',
                    { className: 'days' },
                    days,
                    this.props.children
                )
            )
        );
    }
});

Dayz.EventsCollection = EventsCollection;

module.exports = Dayz;