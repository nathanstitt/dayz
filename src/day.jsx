import React  from 'react'
import Layout from './data/layout'
import Event  from './event'


const IsDayClass = new RegExp('(\\s|^)(events|day|label)(\\s|$)')

const Day = React.createClass({

    propTypes: {
        editComponent:  React.PropTypes.func,
        labelComponent: React.PropTypes.func,
        day:            React.PropTypes.object.isRequired,
        layout:         React.PropTypes.instanceOf(Layout).isRequired,
        onClick:        React.PropTypes.func,
        onEventClick:   React.PropTypes.func
    },

    onClick(ev) {
        if (!this.props.onClick || !IsDayClass.test(ev.target.className)){ return }
        const bounds = this.refs.events.getBoundingClientRect()
        const hours = 24 * ((ev.clientY - bounds.top) / ev.target.offsetHeight )
        this.props.onClick( ev, this.props.day.clone().startOf('day').add( hours, 'hour' ) )
    },

    render() {
        const Label = this.props.labelComponent
        const classes=['day']
        if (this.props.layout.isDateOutsideRange(this.props.day)){
            classes.push('outside')
        }
        const singleDayEvents = []
        const allDayEvents    = []
        for( const layout of this.props.layout.forDay(this.props.day) ){
            const event = (
                <Event
                    editComponent={this.props.editComponent}
                    onClick={this.props.onEventClick}
                    key={layout.event.key}
                    day={this.props.day}
                    layout={layout}
                />
            );
            (layout.event.isSingleDay() ? singleDayEvents : allDayEvents).push(event)
        }

        return (
            <div onClick={this.onClick} className={classes.join(' ')}>
                <Label day={this.props.day} className="label">{this.props.day.format('D')}</Label>
                <div {...this.props.layout.propsForAllDayEventContainer()}>{allDayEvents}</div>
                <div ref="events" className="events">{singleDayEvents}</div>
            </div>
        )
    }

})

export default Day
