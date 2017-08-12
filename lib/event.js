var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import EventLayout from './data/event-layout';

var IsResizeClass = new RegExp('(\\s|^)event(\\s|$)');

var Event = function (_PureComponent) {
    _inherits(Event, _PureComponent);

    function Event() {
        _classCallCheck(this, Event);

        return _possibleConstructorReturn(this, (Event.__proto__ || Object.getPrototypeOf(Event)).apply(this, arguments));
    }

    _createClass(Event, [{
        key: 'onClick',
        value: function onClick(ev) {
            if (!this.props.onClick) {
                return;
            }
            this.props.onClick(ev, this.props.layout.event);
            ev.stopPropagation();
        }
    }, {
        key: 'onDoubleClick',
        value: function onDoubleClick(ev) {
            if (!this.props.onDoubleClick) {
                return;
            }
            this.props.onDoubleClick(ev, this.props.layout.event);
            ev.stopPropagation();
        }
    }, {
        key: 'onDragStart',
        value: function onDragStart(ev) {
            if (!IsResizeClass.test(ev.target.className)) {
                return;
            }
            var bounds = findDOMNode(this.refs.element).getBoundingClientRect();
            var resize = void 0;
            if (ev.clientY - bounds.top < 10) {
                resize = { type: 'start' };
            } else if (bounds.bottom - ev.clientY < 10) {
                resize = { type: 'end' };
            } else {
                return;
            }
            this.props.onDragStart(resize, this.props.layout);
        }
    }, {
        key: 'render',
        value: function render() {
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
    }]);

    return Event;
}(PureComponent);

Event.propTypes = {
    layout: PropTypes.instanceOf(EventLayout),
    editComponent: PropTypes.func,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func
};
export default Event;