'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var Layout = require('./data/layout');
var Event = require('./event');
var Label = require('./label');
var assign = require('lodash/assign');
var each = require('lodash/each');
var ReactDOM = require('react-dom');

var IsDayClass = new RegExp('(\\s|^)(events|day|label)(\\s|$)');

var Day = React.createClass({
    displayName: 'Day',


    propTypes: {
        day: React.PropTypes.object.isRequired,
        layout: React.PropTypes.instanceOf(Layout).isRequired,
        position: React.PropTypes.number.isRequired,
        onClick: React.PropTypes.func,
        onDoubleClick: React.PropTypes.func,
        onEventClick: React.PropTypes.func,
        onEventResize: React.PropTypes.func,
        editComponent: React.PropTypes.func,
        onEventDoubleClick: React.PropTypes.func
    },

    getInitialState: function getInitialState() {
        return { resize: false };
    },
    getBounds: function getBounds() {
        return ReactDOM.findDOMNode(this.refs.events || this.refs.root).getBoundingClientRect();
    },
    _onClickHandler: function _onClickHandler(ev, handler) {
        if (!handler || !IsDayClass.test(ev.target.className) || this.lastMouseUp && this.lastMouseUp < new Date().getMilliseconds() + 100) {
            return;
        }
        this.lastMouseUp = 0;
        var bounds = this.getBounds();
        var perc = (ev.clientY - bounds.top) / ev.target.offsetHeight;
        var hours = this.props.layout.displayHours[0] + this.props.layout.minutesInDay() * perc / 60;
        handler.call(this, ev, this.props.day.clone().startOf('day').add(hours, 'hour'));
    },
    onClick: function onClick(ev) {
        this._onClickHandler(ev, this.props.onClick);
    },
    onDoubleClick: function onDoubleClick(ev) {
        this._onClickHandler(ev, this.props.onDoubleClick);
    },
    onDragStart: function onDragStart(resize, eventLayout) {
        eventLayout.setIsResizing(true);
        var bounds = this.getBounds();
        assign(resize, { eventLayout: eventLayout, height: bounds.height, top: bounds.top });
        this.setState({ resize: resize });
    },
    onMouseMove: function onMouseMove(ev) {
        if (!this.state.resize) {
            return;
        }
        var coord = ev.clientY - this.state.resize.top;
        this.state.resize.eventLayout.adjustEventTime(this.state.resize.type, coord, this.state.resize.height);
        this.forceUpdate();
    },
    onMouseUp: function onMouseUp(ev) {
        var _this = this;

        if (!this.state.resize) {
            return;
        }
        this.state.resize.eventLayout.setIsResizing(false);
        setTimeout(function () {
            return _this.setState({ resize: false });
        }, 1);
        if (this.props.onEventResize) {
            this.props.onEventResize(ev, this.state.resize.eventLayout.event);
        }
        this.lastMouseUp = new Date().getMilliseconds();
    },
    renderEvents: function renderEvents() {
        var _this2 = this;

        var asMonth = this.props.layout.isDisplayingAsMonth();
        var singleDayEvents = [];
        var allDayEvents = [];
        var onMouseMove = asMonth ? null : this.onMouseMove;
        each(this.props.layout.forDay(this.props.day), function (layout) {
            var event = React.createElement(Event, {
                layout: layout,
                key: layout.key(),
                day: _this2.props.day,
                parent: _this2,
                onDragStart: _this2.onDragStart,
                onClick: _this2.props.onEventClick,
                editComponent: _this2.props.editComponent,
                onDoubleClick: _this2.props.onEventDoubleClick
            });
            (layout.event.isSingleDay() ? singleDayEvents : allDayEvents).push(event);
        });
        var events = [];
        if (allDayEvents.length || !asMonth) {
            events.push(React.createElement(
                'div',
                _extends({ key: 'allday' }, this.props.layout.propsForAllDayEventContainer()),
                allDayEvents
            ));
        }
        if (singleDayEvents.length) {
            events.push(React.createElement(
                'div',
                { key: 'events', ref: 'events', className: 'events',
                    onMouseMove: onMouseMove, onMouseUp: this.onMouseUp },
                singleDayEvents
            ));
        }
        return events;
    },
    render: function render() {
        var props = this.props.layout.propsForDayContainer(this.props);

        return React.createElement(
            'div',
            _extends({ ref: 'root'
            }, props, {
                onClick: this.onClick,
                onDoubleClick: this.onDoubleClick
            }),
            React.createElement(
                Label,
                { day: this.props.day, className: 'label' },
                this.props.day.format('D')
            ),
            this.renderEvents()
        );
    }
});

module.exports = Day;