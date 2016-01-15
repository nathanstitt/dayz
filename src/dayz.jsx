const React     = require('react');
const moment    = require('moment');
const Layout    = require('./data/layout');
const Day       = require('./day');
const XLabels   = require('./x-labels');
const YLabels   = require('./y-labels');

require('moment-range'); // needed in order to for range to install itself

const EventsCollection = require('./data/events-collection');

const Dayz = React.createClass({

    propTypes: {
        editComponent:     React.PropTypes.func,
        display:           React.PropTypes.oneOf(['month', 'week', 'day']),
        date:              React.PropTypes.object.isRequired,
        displayHours:      React.PropTypes.array,
        events:            React.PropTypes.instanceOf(EventsCollection),
        onDayClick:        React.PropTypes.func,
        onDayDoubleClick:  React.PropTypes.func,
        onEventClick:      React.PropTypes.func,
        onEventResize:     React.PropTypes.func
    },

    getDefaultProps() {
        return {
            display:      'month'
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
        const classes = ["dayz", this.props.display];
        const days = [];
        this.state.range.by('days', (day) =>
            days.push(<Day key={day.format('YYYYMMDD')}
                           day={day}
                           position={days.length}
                           layout={this.state.layout}
                           editComponent={this.props.editComponent}
                           onClick={this.props.onDayClick}
                           onDoubleClick={this.props.onDayDoubleClick}
                           onEventClick={this.props.onEventClick}
                           onEventResize={this.props.onEventResize}

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
                    <div className="days">
                        {days}
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

});

Dayz.EventsCollection = EventsCollection;

module.exports = Dayz;
