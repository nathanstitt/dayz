const Dayz   = require('../src/dayz');
const React  = require('react');
const moment = require('moment');
require('moment-range');

let COUNT = 1;

class DayzTestComponent extends React.Component {

    constructor(props) {
        super(props);
        this.addEvent = this.addEvent.bind(this);
        this.onEventClick = this.onEventClick.bind(this);
        this.editComponent = this.editComponent.bind(this);
        this.changeDisplay = this.changeDisplay.bind(this);
        this.onEventResize = this.onEventResize.bind(this);
        const date = moment("2015-09-11");
        this.state = {
            date,
            display: 'week',
            events: new Dayz.EventsCollection([
                { content: 'Continuing event Past',
                  range: moment.range( moment('2015-09-08'), moment('2015-09-14') ) },

                { content: 'Continuing event Before',
                  range: moment.range( '2015-09-04','2015-09-09') },

                { content: "Weeklong",
                  range: moment.range('2015-09-06',moment('2015-09-12').endOf('day') ) },

                { content: "A Longer Event",
                  range: moment.range( moment('2015-09-04'), moment('2015-09-14') )},

                { content: "Inclusive",
                  range: moment.range( moment('2015-09-07'), moment('2015-09-12') )},

                { content: '9am - 2pm (resizable)',
                  resizable: {step: 15},
                  range: moment.range( moment('2015-09-11').hour(9),
                                       moment('2015-09-11').hour(14))},

                { content: '8am - 8pm (non-resizable)',
                  range: moment.range( moment('2015-09-07').hour(8),
                                       moment('2015-09-07').hour(20) ) }
            ])
        };
    }

    changeDisplay(ev) {
        this.setState({ display: ev.target.value });
    }

    onEventClick(ev, event) {
        event.set({editing: !event.isEditing()});
    }
    onEventResize(ev, event) {
        const start = event.start().format('hh:mma');
        const end   = event.end().format('hh:mma');
        event.set({content: `${start} - ${end} (resizable)`});
    }
    addEvent(ev, date) {
        this.state.events.add(
            { content: `Event ${COUNT++}`,
              resizable: true,
              range: moment.range( date.clone(),
                                   date.clone().add(1, 'hour').add(45, 'minutes'))}
        );
    }

    editComponent(props) {
        const onBlur   = function() { props.event.set({editing: false}); };
        const onChange = function(ev){ props.event.set({content: ev.target.value}); };
        const onDelete = function() { props.event.remove(); };
        return (
            <div className="edit">
                <input type="text" autoFocus
                       value={props.event.content()}
                       onChange={onChange}
                       onBlur={onBlur}
                />
                <button onClick={onDelete}>X</button>
            </div>
        );
    }

    render() {

        return (
            <div className="dayz-test-wrapper">

                <div className="tools">
                    <label>
                        Month: <input type="radio"
                                      name="style" value="month" onChange={this.changeDisplay}
                                      checked={this.state.display === 'month'} />
                    </label><label>
                        Week: <input type="radio"
                                     name="style" value="week" onChange={this.changeDisplay}
                                     checked={this.state.display === 'week'} />
                    </label><label>
                        Day: <input type="radio"
                                    name="style" value="day" onChange={this.changeDisplay}
                                    checked={this.state.display === 'day'} />
                    </label>
                </div>

                <Dayz {...this.state}
                      displayHours={[6, 22]}
                      onEventResize={this.onEventResize}
                      editComponent={this.editComponent}
                      onDayDoubleClick={this.addEvent}
                      onEventClick={this.onEventClick}
                >
                </Dayz>
            </div>
        );
    }
}

module.exports = DayzTestComponent;
