const Dayz = require('../src/dayz');

const div      = document.createElement('div');
const moment   = require('moment');
const DateRange = require('moment-range');
const React     = require('react');
const ReactDOM  = require('react-dom');

document.body.appendChild(div);

const date = moment("2015-09-11")

const events = new Dayz.EventsCollection;
events.add({
    content: 'A short event',
    range: new DateRange( date, date.clone().add(1, 'day') )
});

events.add({
    content: "A Longer Event",
    range: moment.range( date.clone().subtract(2,'days'), date.clone().add(8,'days') )
});

events.add({
    content: "21st ~ 25th event",
    range: moment.range( "2015-09-21", "2015-09-25" )
});

const comp = React.createElement(Dayz, {display:'month', date, events} );

ReactDOM.render( comp, div );
