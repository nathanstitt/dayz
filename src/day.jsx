import React  from 'react';
import Layout from './data/layout';
import Event  from './event';
import map    from 'lodash/collection/map';

const Day = React.createClass({

    propTypes: {
        editComponent:  React.PropTypes.func,
        labelComponent: React.PropTypes.func,
        day:            React.PropTypes.object.isRequired,
        layout:         React.PropTypes.instanceOf(Layout),
        onClick:        React.PropTypes.func,
        onEventClick:   React.PropTypes.func
    },

    onClick(ev) {
        if (!this.props.onClick){ return }
        const bounds = ev.currentTarget.getBoundingClientRect();
        const hours = 24 * ((ev.clientY - bounds.top) / ev.target.offsetHeight );
        this.props.onClick( ev, this.props.day.clone().startOf('day').add( hours, 'hour' ) );
    },

    render() {
        const Label = this.props.labelComponent;
        const classes=['day'];
        if (this.props.layout.isDateOutsideRange(this.props.day)){
            classes.push('outside');
        }
        const events = map( this.props.layout.forDay(this.props.day), (layout) =>
            <Event
                isEditing={this.props.layout.isEditing(layout.event)}
                editComponent={this.props.editComponent}
                onClick={this.props.onEventClick}
                key={layout.event.key}
                day={this.props.day}
                layout={layout}
            />
        );
        return (
            <div onClick={this.onClick}
                 className={classes.join(' ')}
                 key={this.props.day.format('YYYYMMDD')}
            >
                <Label day={this.props.day} className="label">{this.props.day.format('D')}</Label>
                {events}
            </div>
        );
    }

});

export default Day;
