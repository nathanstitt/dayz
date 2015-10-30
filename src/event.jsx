import React from 'react';
import EventLayout from './data/event-layout';

const Event = React.createClass({

    propTypes: {
        layout:        React.PropTypes.instanceOf(EventLayout),
        editComponent: React.PropTypes.func,
        onClick:       React.PropTypes.func
    },

    onClick(ev) {
        if (!this.props.onClick){ return }
        this.props.onClick(ev, this.props.layout.event);
        ev.stopPropagation();
    },

    render() {
        const classes = ['event', `span-${this.props.layout.span}`];

        if (this.props.layout.startsBefore) classes.push('is-continuation');
        if (this.props.layout.endsAfter)    classes.push('is-continued');
        if (this.props.layout.stack)        classes.push(`stack-${this.props.layout.stack}`);

        let edit;
        if (this.props.layout.isEditing()){
            classes.push('is-editing');
            edit = <this.props.editComponent event={this.props.layout.event} />
        }
        return (
            <div onClick={this.onClick}
                 key={this.props.layout.event.key}
                 style={this.props.layout.inlineStyles()}
                 className={classes.join(' ')}
            >
                {this.props.layout.event.render()}
                {edit}
            </div>
        );
    }

});

export default Event;
