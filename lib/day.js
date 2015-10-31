'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dataLayout = require('./data/layout');

var _dataLayout2 = _interopRequireDefault(_dataLayout);

var _event2 = require('./event');

var _event3 = _interopRequireDefault(_event2);

var IsDayClass = new RegExp('(\\s|^)(events|day|label)(\\s|$)');

var Day = _react2['default'].createClass({
    displayName: 'Day',

    propTypes: {
        editComponent: _react2['default'].PropTypes.func,
        labelComponent: _react2['default'].PropTypes.func,
        day: _react2['default'].PropTypes.object.isRequired,
        layout: _react2['default'].PropTypes.instanceOf(_dataLayout2['default']).isRequired,
        onClick: _react2['default'].PropTypes.func,
        onEventClick: _react2['default'].PropTypes.func
    },

    onClick: function onClick(ev) {
        if (!this.props.onClick || !IsDayClass.test(ev.target.className)) {
            return;
        }
        var bounds = this.refs.events.getBoundingClientRect();
        var hours = 24 * ((ev.clientY - bounds.top) / ev.target.offsetHeight);
        this.props.onClick(ev, this.props.day.clone().startOf('day').add(hours, 'hour'));
    },

    render: function render() {
        var Label = this.props.labelComponent;
        var classes = ['day'];
        if (this.props.layout.isDateOutsideRange(this.props.day)) {
            classes.push('outside');
        }
        var singleDayEvents = [];
        var allDayEvents = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.props.layout.forDay(this.props.day)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var layout = _step.value;

                var _event = _react2['default'].createElement(_event3['default'], {
                    editComponent: this.props.editComponent,
                    onClick: this.props.onEventClick,
                    key: layout.event.key,
                    day: this.props.day,
                    layout: layout
                })(layout.event.isSingleDay() ? singleDayEvents : allDayEvents).push(_event);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return _react2['default'].createElement(
            'div',
            { onClick: this.onClick, className: classes.join(' ') },
            _react2['default'].createElement(
                Label,
                { day: this.props.day, className: 'label' },
                this.props.day.format('D')
            ),
            _react2['default'].createElement(
                'div',
                this.props.layout.propsForAllDayEventContainer(),
                allDayEvents
            ),
            _react2['default'].createElement(
                'div',
                { ref: 'events', className: 'events' },
                singleDayEvents
            )
        );
    }

});

exports['default'] = Day;
module.exports = exports['default'];