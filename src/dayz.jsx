import React     from 'react';
import moment    from 'moment';
import Layout    from './data/layout';
import Day       from './day';
import Label     from './label';
import XLabels   from './x-labels';
import YLabels   from './y-labels';

require('moment-range'); // needed in order to for range to install itself

import EventsCollection from './data/events-collection';

const Dayz = React.createClass({

    propTypes: {
        display:           React.PropTypes.oneOf(['month', 'week', 'day']),
        date:              React.PropTypes.object.isRequired,
        displayHours:      React.PropTypes.array,
        dayComponent:      React.PropTypes.func,
        editComponent:     React.PropTypes.func,
        events:            React.PropTypes.instanceOf(EventsCollection),
        dayLabelComponent: React.PropTypes.func,
        onDayClick:        React.PropTypes.func,
        onEventClick:      React.PropTypes.func,
        onEventResize:     React.PropTypes.func
    },

    getDefaultProps() {
        return {
            displayHours:      [0, 24],
            dayLabelComponent: Label,
            dayComponent:      Day,
            display:           'month'
        };
    },

    componentWillMount() {
        this.calculateLayout(this.props);
    },

    componentWillUnmount() {
        this.detachEventBindings();
    },

    detachEventBindings() {
        if (this.props.events){ this.props.events.off('change', this.onEventAdd); }
    },

    componentWillReceiveProps(nextProps){
        this.calculateLayout(nextProps);
    },

    onEventsChange() {
        this.calculateLayout(this.props);
    },

    calculateLayout(props) {
        const range = moment.range( props.date.clone().startOf( props.display ),
                                    props.date.clone().endOf( props.display ) );
        if (props.events) {
            this.detachEventBindings();
            props.events.on('change', this.onEventsChange, this);
        }
        if ( props.display === 'month' ) {
            range.start.subtract(range.start.weekday(), 'days');
            range.end.add(6 - range.end.weekday(), 'days');
        }

        const layout = new Layout({...props, range});

        this.setState({ range, layout });
    },

    render() {
        const DayComp = this.props.dayComponent;
        const classes = ["dayz", this.props.display];
        const days = [];
        this.state.range.by('days', (day) =>
            days.push(<DayComp key={day.format('YYYYMMDD')}
                               day={day}
                               layout={this.state.layout}
                               editComponent={this.props.editComponent}
                               onClick={this.props.onDayClick}
                               onEventClick={this.props.onEventClick}
                               onEventResize={this.props.onEventResize}
                               labelComponent={this.props.dayLabelComponent}
                      />)
        );
        return (
            <div className={classes.join(' ')}>
                <XLabels date={this.props.date} display={this.props.display} />
                <div className="body">
                    <YLabels
                        layout={this.state.layout}
                        display={this.props.display}
                        date={this.props.date}
                    />
                    <div className="days">{days}</div>
                </div>
            </div>
        );
    }

});

Dayz.EventsCollection = EventsCollection;

export default Dayz;
