/*eslint no-console: 0*/

const Dayz = require('../src/dayz');

const moment    = require('moment');
require('moment-range');
const React     = require('react');
const ReactDOM  = require('react-dom');

let COUNT = 1;

class DayzTest extends React.Component {

    constructor(props) {
        super(props);
        this.addEvent = this.addEvent.bind(this);
        this.onEventClick = this.onEventClick.bind(this);
        this.changeDisplay = this.changeDisplay.bind(this);
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

                { content: '7 - 12am',
                  resizable: {step: 15},
                  range: moment.range( moment('2015-09-07').hour(7).minute(9),
                                       moment('2015-09-07').hour(12))},

                { content: '8 - 10pm',
                  range: moment.range( date.clone().hour(20),
                                       date.clone().hour(22) ) }
            ])
        };
    }

    changeDisplay(ev) {
        this.setState({ display: ev.target.value });
    }

    onEventClick(ev, event) {
        event.set({editing: !event.isEditing()});
    }

    onDayClick(ev, date) {
        console.log( date.toString() );
    }

    addEvent() {
        const event = this.state.events.add(
            { content: `Event ${COUNT++}`,
              range: moment.range( this.state.date.clone().add(COUNT, 'hour'),
                                   this.state.date.clone().add(COUNT, 'hour').add(45, 'minutes'))}
        );
        //
        setTimeout( function(){
            event.set({ content: (event.content() + ' : updated') });
        }, 4000);
    }

    editComponent() {
        return (
            <span>editing!</span>
        );
    }

    render() {
        return (
            <div className="test-wrapper">
                <Dayz {...this.state}
                      editComponent={this.editComponent}
                      onDayClick={this.onDayClick}
                      onEventClick={this.onEventClick}
                      displayHours={[7,18]}
                />
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
                    </label><label>
                        <button onClick={this.addEvent}>+</button>
                    </label>
                </div>
            </div>
        );
    }

}


const div = document.createElement('div');
document.body.appendChild(div);
ReactDOM.render( React.createElement(DayzTest, {} ), div );
