const Dayz = require('../src/dayz');

const moment    = require('moment');
const DateRange = require('moment-range');
const React     = require('react');
const ReactDOM  = require('react-dom');

class DayzTest extends React.Component {

    constructor(props) {
        super(props);
        this.changeDisplay = this.changeDisplay.bind(this)
        const date = moment("2015-09-11");
        this.state = {
            date,
            display: 'week',
            events: new Dayz.EventsCollection([
                { content: 'A short event',
                  range: new DateRange( date.clone(), date.clone().add(1, 'day') ) },
                { content: 'Two Hours ~ 8-10',
                  range: new DateRange( date.clone().hour(8),
                                        date.clone().hour(10) ) },
                { content: "A Longer Event",
                  range: moment.range( date.clone().subtract(2,'days'), date.clone().add(8,'days') ) }
            ])
        };
    }

    changeDisplay(ev) {
        this.setState({ display: ev.target.value })
    }


    render(){
        return (
            <div className="test-wrapper">
                <Dayz {...this.state} />
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
                    </label>
                </div>
            </div>
        );
    }

}




const div = document.createElement('div');
document.body.appendChild(div);
ReactDOM.render( React.createElement(DayzTest, {} ), div );
