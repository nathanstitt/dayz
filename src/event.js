import React       from 'react';
import ReactDOM    from 'react-dom';
import PropTypes   from 'prop-types';
import Duration from './api/duration';

const IsResizeClass = new RegExp('(\\s|^)event(\\s|$)');

export default class Event extends React.Component {

    static propTypes = {
        duration:        PropTypes.instanceOf(Duration),
        editComponent: PropTypes.func,
        onClick:       PropTypes.func,
        onDoubleClick: PropTypes.func,
    }

    constructor(props) {
        super(props);
        [
            'onClick', 'onDoubleClick', 'onDoubleClick', 'onDragStart',
        ].forEach((ev) => {
            this[ev] = this[ev].bind(this);
        });
    }

    onClick(ev) {
        if (!this.props.onClick) { return; }
        this.props.onClick(ev, this.props.duration.event);
        ev.stopPropagation();
    }

    onDoubleClick(ev) {
        if (!this.props.onDoubleClick) { return; }
        this.props.onDoubleClick(ev, this.props.duration.event);
        ev.stopPropagation();
    }

    onDragStart(ev) {
        if (!IsResizeClass.test(ev.target.className)) { return; }
        const bounds = ReactDOM.findDOMNode(this.refs.element).getBoundingClientRect();
        let resize;
        if (ev.clientY - bounds.top < 10) {
            resize = { type: 'start' };
        } else if (bounds.bottom - ev.clientY < 10) {
            resize = { type: 'end' };
        } else {
            return;
        }
        this.props.onDragStart(resize, this.props.duration);
    }

    render() {
        const body = (
            <div className="evbody" onClick={this.onClick}>
                {this.props.duration.event.render()}
            </div>
        );
        const Edit = this.props.editComponent;
        const children = this.props.duration.isEditing()
            ? (<Edit event={this.props.duration.event} >{body}</Edit>) : body;
        return (
            <div
                ref="element"
                onMouseDown={this.onDragStart}
                style={this.props.duration.inlineStyles()}
                className={this.props.duration.classNames()}
            >
                {children}
            </div>
        );
    }

}
