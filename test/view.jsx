const Dayz = require('../src/dayz');

const moment    = require('moment');
const DateRange = require('moment-range');
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
                { content: 'A short event',
                  range: new DateRange( date.clone(), date.clone().add(1, 'day') ) },
                { content: 'Two Hours',
                  range: new DateRange( date.clone().hour(20),
                                        date.clone().hour(22) ) },
                { content: "A Longer Event",
                  range: moment.range( date.clone().subtract(2,'days'), date.clone().add(8,'days') ) },
                { content: "Weeklong",
                  range: moment.range( moment('2015-09-20'), moment('2015-09-26').endOf('day') ) }
            ])
        };
    }

    changeDisplay(ev) {
        this.setState({ display: ev.target.value })
    }

    onEventClick(ev, event) {
        event.set({editing: !event.isEditing()})
    }

    onDayClick(ev, date) {
        console.log( date.toString() )
    }

    addEvent() {
        const event = this.state.events.add(
            { content: `Event ${COUNT++}`,
              range: new DateRange( this.state.date.clone().add(COUNT, 'hour'),
                                    this.state.date.clone().add(COUNT, 'hour').add(45, 'minutes') ) }
        );
        //
        setTimeout( function(){
            event.set({ content: (event.content() + ' : updated') });
        }, 4000);
    }

    editComponent(props) {
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
                />
                <div className="tools">
                    <label>
                        Month: <input type="radio" name="style" value="month" onChange={this.changeDisplay}
                                      checked={this.state.display == 'month'} />
                    </label><label>
                        Week: <input type="radio" name="style"  value="week"  onChange={this.changeDisplay}
                                     checked={this.state.display == 'week'}  />
                    </label><label>
                        Day: <input type="radio" name="style"   value="day"   onChange={this.changeDisplay}
                                    checked={this.state.display == 'day'}   />
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
