var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import Event from './event';
import Layout from './data/layout';
import Label from './label';

var IsDayClass = new RegExp('(\\s|^)(events|day|label)(\\s|$)');

var Day = function (_PureComponent) {
    _inherits(Day, _PureComponent);

    function Day() {
        _classCallCheck(this, Day);

        var _this = _possibleConstructorReturn(this, (Day.__proto__ || Object.getPrototypeOf(Day)).call(this));

        _this.state = { resize: false };
        return _this;
    }

    _createClass(Day, [{
        key: 'onClickHandler',
        value: function onClickHandler(ev, handler) {
            if (!handler || !IsDayClass.test(ev.target.className) || this.lastMouseUp && this.lastMouseUp < new Date().getMilliseconds() + 100) {
                return;
            }
            this.lastMouseUp = 0;
            var bounds = this.boundingBox;
            var perc = (ev.clientY - bounds.top) / ev.target.offsetHeight;
            var hours = this.props.layout.displayHours[0] + this.props.layout.minutesInDay() * perc / 60;
            handler.call(this, ev, this.props.day.clone().startOf('day').add(hours, 'hour'));
        }
    }, {
        key: 'onClick',
        value: function onClick(ev) {
            this.onClickHandler(ev, this.props.onClick);
        }
    }, {
        key: 'onDoubleClick',
        value: function onDoubleClick(ev) {
            this.onClickHandler(ev, this.props.onDoubleClick);
        }
    }, {
        key: 'onDragStart',
        value: function onDragStart(resize, eventLayout) {
            eventLayout.setIsResizing(true);
            var bounds = this.getBounds();
            Object.assign(resize, { eventLayout: eventLayout, height: bounds.height, top: bounds.top });
            this.setState({ resize: resize });
        }
    }, {
        key: 'onMouseMove',
        value: function onMouseMove(ev) {
            if (!this.state.resize) {
                return;
            }
            var coord = ev.clientY - this.state.resize.top;
            this.state.resize.eventLayout.adjustEventTime(this.state.resize.type, coord, this.state.resize.height);
            this.forceUpdate();
        }
    }, {
        key: 'onMouseUp',
        value: function onMouseUp(ev) {
            var _this2 = this;

            if (!this.state.resize) {
                return;
            }
            this.state.resize.eventLayout.setIsResizing(false);
            setTimeout(function () {
                return _this2.setState({ resize: false });
            }, 1);
            if (this.props.onEventResize) {
                this.props.onEventResize(ev, this.state.resize.eventLayout.event);
            }
            this.lastMouseUp = new Date().getMilliseconds();
        }
    }, {
        key: 'renderEvents',
        value: function renderEvents() {
            var _this3 = this;

            var asMonth = this.props.layout.isDisplayingAsMonth();
            var singleDayEvents = [];
            var allDayEvents = [];
            var onMouseMove = asMonth ? null : this.onMouseMove;
            this.props.layout.forDay(this.props.day).forEach(function (layout) {
                var event = React.createElement(Event, {
                    layout: layout,
                    key: layout.key(),
                    day: _this3.props.day,
                    parent: _this3,
                    onDragStart: _this3.onDragStart,
                    onClick: _this3.props.onEventClick,
                    editComponent: _this3.props.editComponent,
                    onDoubleClick: _this3.props.onEventDoubleClick
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
                    {
                        key: 'events', ref: 'events', className: 'events',
                        onMouseMove: onMouseMove, onMouseUp: this.onMouseUp
                    },
                    singleDayEvents
                ));
            }
            return events;
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props.layout.propsForDayContainer(this.props);

            return React.createElement(
                'div',
                _extends({
                    ref: 'root'
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
    }, {
        key: 'boundingBox',
        get: function get() {
            return findDOMNode(this.refs.events || this.refs.root).getBoundingClientRect();
        }
    }]);

    return Day;
}(PureComponent);

Day.propTypes = {
    day: PropTypes.object.isRequired,
    layout: PropTypes.instanceOf(Layout).isRequired,
    position: PropTypes.number.isRequired,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onEventClick: PropTypes.func,
    onEventResize: PropTypes.func,
    editComponent: PropTypes.func,
    onEventDoubleClick: PropTypes.func
};
export default Day;