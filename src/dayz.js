import React     from 'react';
import PropTypes from 'prop-types';
import moment    from './moment-range';
import Layout    from './api/layout';
import Day       from './day';
import XLabels   from './x-labels';
import YLabels   from './y-labels';
import EventsCollection from './api/events-collection';

export default class Dayz extends React.Component {

    static EventsCollection = EventsCollection;

    static propTypes = {
        editComponent:     PropTypes.func,
        date:              PropTypes.object.isRequired,
        displayHours:      PropTypes.array,
        display:           PropTypes.oneOf(['month', 'week', 'day']),
        events:            PropTypes.instanceOf(EventsCollection),
        // onDayClick:        PropTypes.func,
        // onDayDoubleClick:  PropTypes.func,
        onEventClick:      PropTypes.func,
        onEventResize:     PropTypes.func,
        timeFormat:        PropTypes.string,
        dayEvents:         PropTypes.object,
        highlightDays:     PropTypes.oneOfType(
            [PropTypes.array, PropTypes.func],
        ),
    }

    static defaultProps = {
        display: 'month',
    }

    constructor(props) {
        super();
        this.state = this.calculateLayout(props);
    }

    componentWillUnmount() {
        this.detachEventBindings();
    }

    detachEventBindings() {
        if (this.props.events) { this.props.events.off('change', this.onEventAdd); }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.calculateLayout(nextProps));
    }

    onEventsChange() {
        this.setState(this.calculateLayout(this.props));
    }

    calculateLayout(props) {
        const range = moment.range(moment(props.date).startOf(props.display),
            moment(props.date).endOf(props.display));
        if (props.events) {
            this.detachEventBindings();
            props.events.on('change', this.onEventsChange, this);
        }
        if ('month' === props.display) {
            range.start.subtract(range.start.weekday(), 'days');
            range.end.add(6 - range.end.weekday(), 'days');
        }
        const newState = {
            range,
            layout: new Layout({ ...props, range }),
        };

        return newState;
    }

    get days() {
        return Array.from(this.state.range.by('days'));
    }

    renderDays() {
        return this.days.map((day, index) => (
            <Day
                key={day.format('YYYYMMDD')}
                day={day}
                position={index}
                layout={this.state.layout}
                editComponent={this.props.editComponent}
                handlers={this.props.dayEventHandlers}
                eventHandlers={this.props.eventHandlers}
                onEventClick={this.props.onEventClick}
                onEventResize={this.props.onEventResize}
            />
        ));
    }

    render() {
        const classes = ['dayz', this.props.display];
        return (
            <div className={classes.join(' ')}>
                <XLabels date={this.props.date} display={this.props.display} />
                <div className="body">
                    <YLabels
                        layout={this.state.layout}
                        display={this.props.display}
                        date={this.props.date}
                        timeFormat={this.props.timeFormat}
                    />
                    <div className="days">
                        {this.renderDays()}
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

}
