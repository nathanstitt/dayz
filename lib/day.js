'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _layout = require('./data/layout');

var _layout2 = _interopRequireDefault(_layout);

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

var _label = require('./label');

var _label2 = _interopRequireDefault(_label);

var _assign = require('lodash/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IsDayClass = new RegExp('(\\s|^)(events|day|label)(\\s|$)');

var Day = _react2.default.createClass({
    displayName: 'Day',

    propTypes: {
        day: _react2.default.PropTypes.object.isRequired,
        layout: _react2.default.PropTypes.instanceOf(_layout2.default).isRequired,
        onClick: _react2.default.PropTypes.func,
        onDoubleClick: _react2.default.PropTypes.func,
        onEventClick: _react2.default.PropTypes.func,
        onEventResize: _react2.default.PropTypes.func,
        editComponent: _react2.default.PropTypes.func,
        onEventDoubleClick: _react2.default.PropTypes.func
    },

    getInitialState: function getInitialState() {
        return { resize: false };
    },
    _onClickHandler: function _onClickHandler(ev, handler) {
        if (!handler || !IsDayClass.test(ev.target.className)) {
            return;
        }
        var bounds = this.refs.events.getBoundingClientRect();
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
        var bounds = this.refs.events.getBoundingClientRect();
        (0, _assign2.default)(resize, { eventLayout: eventLayout, height: bounds.height, top: bounds.top });
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
    },
    render: function render() {
        var classes = ['day'];
        if (this.props.layout.isDateOutsideRange(this.props.day)) {
            classes.push('outside');
        }
        var singleDayEvents = [];
        var allDayEvents = [];
        var onMouseMove = this.props.layout.isDisplayingAsMonth() ? null : this.onMouseMove;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.props.layout.forDay(this.props.day)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var layout = _step.value;

                var event = _react2.default.createElement(_event2.default, {
                    layout: layout,
                    key: layout.key(),
                    day: this.props.day,
                    onDragStart: this.onDragStart,
                    onClick: this.props.onEventClick,
                    editComponent: this.props.editComponent,
                    onDoubleClick: this.props.onEventDoubleClick
                });
                (layout.event.isSingleDay() ? singleDayEvents : allDayEvents).push(event);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return _react2.default.createElement(
            'div',
            {
                onClick: this.onClick,
                className: classes.join(' '),
                onDoubleClick: this.onDoubleClick
            },
            _react2.default.createElement(
                _label2.default,
                { day: this.props.day, className: 'label' },
                this.props.day.format('D')
            ),
            _react2.default.createElement(
                'div',
                this.props.layout.propsForAllDayEventContainer(),
                allDayEvents
            ),
            _react2.default.createElement(
                'div',
                { ref: 'events',
                    className: 'events',
                    onMouseMove: onMouseMove,
                    onMouseUp: this.onMouseUp
                },
                singleDayEvents
            )
        );
    }
});

exports.default = Day;