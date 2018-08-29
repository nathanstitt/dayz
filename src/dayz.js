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
        highlightDays:     PropTypes.array,
        display:           PropTypes.oneOf(['month', 'week', 'day']),
        events:            PropTypes.instanceOf(EventsCollection),
        onDayClick:        PropTypes.func,
        onDayDoubleClick:  PropTypes.func,
        onEventClick:      PropTypes.func,
        onEventResize:     PropTypes.func,
        timeFormat:        PropTypes.string,
    }

    static defaultProps = {
        display: 'month',
    }

    componentWillMount() {
        this.calculateLayout(this.props);
    }

    componentWillUnmount() {
        this.detachEventBindings();
    }

    detachEventBindings() {
        if (this.props.events) { this.props.events.off('change', this.onEventAdd); }
    }

    componentWillReceiveProps(nextProps) {
        this.calculateLayout(nextProps);
    }

    onEventsChange() {
        this.calculateLayout(this.props);
    }

    calculateLayout(props) {
        const range = moment.range(props.date.clone().startOf(props.display),
            props.date.clone().endOf(props.display));
        if (props.events) {
            this.detachEventBindings();
            props.events.on('change', this.onEventsChange, this);
        }
        if ('month' === props.display) {
            range.start.subtract(range.start.weekday(), 'days');
            range.end.add(6 - range.end.weekday(), 'days');
        }
        const layout = new Layout({ ...props, range });
        this.setState({ range, layout });
    }

    renderDays() {
        return Array.from(this.state.range.by('days')).map((day, index) =>
            <Day
                key={day.format('YYYYMMDD')}
                day={day}
                position={index}
                layout={this.state.layout}
                editComponent={this.props.editComponent}
                onClick={this.props.onDayClick}
                onDoubleClick={this.props.onDayDoubleClick}
                onEventClick={this.props.onEventClick}
                onEventResize={this.props.onEventResize}
            />);
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
