import React from 'react';
import EventLayout from './data/event-layout';

const MINUTES_IN_DAY = 1440;

const Event = React.createClass({

    propTypes: {
        layout:  React.PropTypes.instanceOf(EventLayout),
        onClick: React.PropTypes.func
    },

    onClick(ev) {
        if (!this.props.onClick){ return }
        this.props.onClick(this.props.layout.event, ev.target);
        ev.stopPropagation();
    },

    render() {
        const classes = ['event', `span-${this.props.layout.span}`];
        let style = {};
        if (this.props.layout.startsBefore) classes.push('is-continuation');
        if (this.props.layout.endsAfter)    classes.push('is-continued');
        if (this.props.layout.stack)        classes.push(`stack-${this.props.layout.stack}`);
        if (this.props.layout.event.isSingleDay()) {
            const {start, end} = this.props.layout.event.daysMinuteRange();
            const top    = ( ( start /  MINUTES_IN_DAY ) * 100).toFixed(2) + '%';
            const bottom = ( 100 - ( ( end / MINUTES_IN_DAY ) * 100 ) ).toFixed(2) + '%';
            style = { top, bottom };
        }
        return (
            <div onClick={this.onClick}
                 key={this.props.layout.event.key}
                 style={style}
                 className={classes.join(' ')}
            >
                {this.props.layout.event.render()}
            </div>
        );
    }

});

export default Event;
