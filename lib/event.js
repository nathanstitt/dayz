'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _eventLayout = require('./data/event-layout');

var _eventLayout2 = _interopRequireDefault(_eventLayout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IsResizeClass = new RegExp('(\\s|^)event(\\s|$)');

var Event = _react2.default.createClass({
    displayName: 'Event',

    propTypes: {
        layout: _react2.default.PropTypes.instanceOf(_eventLayout2.default),
        editComponent: _react2.default.PropTypes.func,
        onClick: _react2.default.PropTypes.func,
        onDoubleClick: _react2.default.PropTypes.func
    },

    onClick: function onClick(ev) {
        if (!this.props.onClick) {
            return;
        }
        this.props.onClick(ev, this.props.layout.event);
        ev.stopPropagation();
    },
    onDoubleClick: function onDoubleClick(ev) {
        if (!this.props.onDoubleClick) {
            return;
        }
        this.props.onDoubleClick(ev, this.props.layout.event);
        ev.stopPropagation();
    },
    onDragStart: function onDragStart(ev) {
        if (!IsResizeClass.test(ev.target.className)) {
            return;
        }
        var bounds = this.refs.element.getBoundingClientRect();
        var resize = undefined;
        if (ev.clientY - bounds.top < 10) {
            resize = { type: 'start' };
        } else if (bounds.bottom - ev.clientY < 10) {
            resize = { type: 'end' };
        } else {
            return;
        }
        this.props.onDragStart(resize, this.props.layout);
    },
    render: function render() {

        var edit = undefined;
        if (this.props.layout.isEditing()) {
            edit = _react2.default.createElement(this.props.editComponent, { parent: this, event: this.props.layout.event });
        }
        return _react2.default.createElement(
            'div',
            {
                ref: 'element',
                onMouseDown: this.onDragStart,
                style: this.props.layout.inlineStyles(),
                className: this.props.layout.classNames()
            },
            _react2.default.createElement(
                'div',
                { className: 'evbody', onClick: this.onClick },
                this.props.layout.event.render()
            ),
            edit
        );
    }
});

exports.default = Event;