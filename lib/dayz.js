var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from './moment-range';
import Layout from './data/layout';
import Day from './day';
import XLabels from './x-labels';
import YLabels from './y-labels';
import EventsCollection from './data/events-collection';

var Dayz = function (_PureComponent) {
    _inherits(Dayz, _PureComponent);

    function Dayz() {
        _classCallCheck(this, Dayz);

        return _possibleConstructorReturn(this, (Dayz.__proto__ || Object.getPrototypeOf(Dayz)).apply(this, arguments));
    }

    _createClass(Dayz, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.calculateLayout(this.props);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.detachEventBindings();
        }
    }, {
        key: 'detachEventBindings',
        value: function detachEventBindings() {
            if (this.props.events) {
                this.props.events.off('change', this.onEventAdd);
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.calculateLayout(nextProps);
        }
    }, {
        key: 'onEventsChange',
        value: function onEventsChange() {
            this.calculateLayout(this.props);
        }
    }, {
        key: 'calculateLayout',
        value: function calculateLayout(props) {
            var range = moment.range(props.date.clone().startOf(props.display), props.date.clone().endOf(props.display));
            if (props.events) {
                this.detachEventBindings();
                props.events.on('change', this.onEventsChange, this);
            }
            if ('month' === props.display) {
                range.start.subtract(range.start.weekday(), 'days');
                range.end.add(6 - range.end.weekday(), 'days');
            }
            var layout = new Layout(_extends({}, props, { range: range }));
            this.setState({ range: range, layout: layout });
        }
    }, {
        key: 'renderDays',
        value: function renderDays() {
            var _this2 = this;

            return Array.from(this.state.range.by('days')).map(function (day, index) {
                return React.createElement(Day, {
                    key: day.format('YYYYMMDD'),
                    day: day,
                    position: index,
                    layout: _this2.state.layout,
                    editComponent: _this2.props.editComponent,
                    onClick: _this2.props.onDayClick,
                    onDoubleClick: _this2.props.onDayDoubleClick,
                    onEventClick: _this2.props.onEventClick,
                    onEventResize: _this2.props.onEventResize
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var classes = ['dayz', this.props.display];
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
                        date: this.props.date,
                        timeFormat: this.props.timeFormat
                    }),
                    React.createElement(
                        'div',
                        { className: 'days' },
                        this.renderDays(),
                        this.props.children
                    )
                )
            );
        }
    }]);

    return Dayz;
}(PureComponent);

Dayz.EventsCollection = EventsCollection;
Dayz.propTypes = {
    editComponent: PropTypes.func,
    date: PropTypes.object.isRequired,
    displayHours: PropTypes.array,
    display: PropTypes.oneOf(['month', 'week', 'day']),
    events: PropTypes.instanceOf(EventsCollection),
    onDayClick: PropTypes.func,
    onDayDoubleClick: PropTypes.func,
    onEventClick: PropTypes.func,
    onEventResize: PropTypes.func,
    timeFormat: PropTypes.string
};
Dayz.defaultProps = {
    display: 'month'
};
export default Dayz;