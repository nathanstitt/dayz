import React     from 'react';
import moment    from 'moment';
import DateRange from 'moment-range';
import map       from 'lodash/collection/map'
import extend    from 'lodash/object/extend'
import Layout    from './layout'
import EventsCollection from './events-collection'

import momentPropTypes from 'react-moment-proptypes';

class Dayz extends React.Component {

    static EventsCollection = EventsCollection

    static propTypes = {
        display:           React.PropTypes.oneOf(['month', 'week', 'day']),
        date:              React.PropTypes.object.isRequired,
        dayComponent:      React.PropTypes.func,
        dayLabelComponent: React.PropTypes.func,
        events:            React.PropTypes.instanceOf(EventsCollection)
    }

    static defaultProps = {
        display: 'month',
        dayLabelComponent: ( (props) => <span className={props.className}>{props.children}</span> ),
        dayComponent:      ( (props) => <div className={props.className}>{props.children}</div>   )
    }

    constructor(props) {
        super(props);
    }

    renderEvent(layout){
        const classes = ['event', `span-${layout.span}`];
        if (layout.startsBefore) classes.push('is-continuation');
        if (layout.endsAfter)    classes.push('is-continued');
        if (layout.stack)        classes.push(`stack-${layout.stack}`)
        return (
            <div key={layout.event.key} className={classes.join(' ')}>
                {layout.event.render()}
            </div>
        );
    }

    renderDay(day){
        const Day   = this.props.dayComponent;
        const Label = this.props.dayLabelComponent;
        const classes=['day'];

        if (this.state.layout.isDateOutsideRange(day)){
            classes.push('outside');
        }
        return (
            <Day className={classes.join(' ')} key={day.format('YYYYMMDD')}>
                <Label className="label">{day.format('D')}</Label>
                {map(this.state.layout.forDay(day), this.renderEvent, this, day)}
            </Day>
        );
    }

    render() {
        const classes = ["dayz", this.props.display];
        const days = []
        this.state.range.by('days', (day) => days.push(this.renderDay(day)) )

        return (
            <div className={classes.join(' ')}>
                {days}
            </div>
        );
    }

    componentWillMount() {
        this.calculateLayout(this.props);
    }

    componentWillReceiveProps(nextProps){
        this.calculateLayout(nextProps);
    }

    calculateLayout(props) {
        const range = new DateRange(props.date.clone().startOf( props.display ),
                                    props.date.clone().endOf(   props.display ) );

        if ( props.display === 'month' ){
            range.start.subtract(range.start.weekday(), 'days');
            range.end.add(6 - range.end.weekday(), 'days');
        }

        const layout = new Layout(props.events, range, { display: props.display, date: props.date})

        this.setState({ range, layout })
    }

}


export default Dayz;
