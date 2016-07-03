'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var EventLayout = require('./data/event-layout');
var IsResizeClass = new RegExp('(\\s|^)event(\\s|$)');

var Event = React.createClass({
    displayName: 'Event',


    propTypes: {
        layout: React.PropTypes.instanceOf(EventLayout),
        editComponent: React.PropTypes.func,
        onClick: React.PropTypes.func,
        onDoubleClick: React.PropTypes.func
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
        var bounds = ReactDOM.findDOMNode(this.refs.element).getBoundingClientRect();
        var resize = void 0;
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
        var body = React.createElement(
            'div',
            { className: 'evbody', onClick: this.onClick },
            this.props.layout.event.render()
        );
        var Edit = this.props.editComponent;
        var children = this.props.layout.isEditing() ? React.createElement(
            Edit,
            { event: this.props.layout.event },
            body
        ) : body;
        return React.createElement(
            'div',
            {
                ref: 'element',
                onMouseDown: this.onDragStart,
                style: this.props.layout.inlineStyles(),
                className: this.props.layout.classNames()
            },
            children
        );
    }
});

module.exports = Event;