'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dataEventLayout = require('./data/event-layout');

var _dataEventLayout2 = _interopRequireDefault(_dataEventLayout);

var Event = _react2['default'].createClass({
    displayName: 'Event',

    propTypes: {
        layout: _react2['default'].PropTypes.instanceOf(_dataEventLayout2['default']),
        editComponent: _react2['default'].PropTypes.func,
        onClick: _react2['default'].PropTypes.func
    },

    onClick: function onClick(ev) {
        if (!this.props.onClick) {
            return;
        }
        this.props.onClick(ev, this.props.layout.event);
        ev.stopPropagation();
    },

    render: function render() {
        var classes = ['event', 'span-' + this.props.layout.span];

        if (this.props.layout.startsBefore) classes.push('is-continuation');
        if (this.props.layout.endsAfter) classes.push('is-continued');
        if (this.props.layout.stack) classes.push('stack-' + this.props.layout.stack);

        var edit = undefined;
        if (this.props.layout.isEditing()) {
            classes.push('is-editing');
            edit = _react2['default'].createElement(this.props.editComponent, { event: this.props.layout.event });
        }
        return _react2['default'].createElement(
            'div',
            { onClick: this.onClick,
                key: this.props.layout.event.key,
                style: this.props.layout.inlineStyles(),
                className: classes.join(' ')
            },
            this.props.layout.event.render(),
            edit
        );
    }

});

exports['default'] = Event;
module.exports = exports['default'];