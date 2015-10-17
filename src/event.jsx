import React from 'react';
import EventModel from './data/event';

class Event extends React.Component {

    static propTypes = {
        layout: React.PropTypes.object.isRequired
    }

    render() {
        const classes = ['event', `span-${this.props.layout.span}`];
        if (this.props.layout.startsBefore) classes.push('is-continuation');
        if (this.props.layout.endsAfter)    classes.push('is-continued');
        if (this.props.layout.stack)        classes.push(`stack-${this.props.layout.stack}`);
        let state = {};
        const range = this.props.layout.event.range()
            if (!this.props.layout.event.isMultiDay()) {
                classes.push(`hour-${range.start.hour()}`);
                classes.push(`duration-${range.diff('hours')}`);
            }
        return (
            <div key={this.props.layout.event.key} className={classes.join(' ')}>
                {this.props.layout.event.render()}
            </div>
        );
    }

}

export default Event;
