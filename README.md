## A day/week/monthly calendar component for React

![alt tag](http://nathan.stitt.org/images/dayz-screenshot.png)

## Demo

An interactive demo can be viewed at: http://nathan.stitt.org/dayz/  It lacks polish but is somewhat functional ;)

## Usage

```bash
npm install dayz --save
```

```js
const React = require("react");
const Dayz = require("react-day-picker");
const moment = require('moment');
require('moment-range');

var MyComponent = React.createComponent({

    componentWillMount() {
        const date = moment('2011-10-21');
        const events = new Dayz.EventsCollection([
            { content: 'A short event',
              range: moment.range( date.clone(),
                                   date.clone().add(1, 'day') ) },
            { content: 'Two Hours ~ 8-10',
              range: moment.range( date.clone().hour(8),
                                   date.clone().hour(10) ) },
            { content: "A Longer Event",
              range: moment.range( date.clone().subtract(2,'days'),
                                   date.clone().add(8,'days') ) }
        ]);
        this.state({events, date});
    }
    render() {
        return <Dayz
                   display='week'
                   date={this.state.date}
                   events={this.state.events} />
    }

});
```

## API

The Dayz component accepts these properties:

 * **date** (required):     An `momentjs` instance that controls what range is displayed. The calandar will automatically calculate the month or week that contains this date and display the appropriate range.
 * **events** (optional):  An `Dayz.EventsCollection` instance that contains events that should be displayed on the calendar.
 * **display** (optional, defaults to 'month'):  One of month, week, or day.
 * **dayComponent** (optional):  A component that should be rendered for each day. The component will recieve a `momentjs` `day` property.  If a custom component is used, it probably should set a css class `day` in order for it to be displayed properly.
 * **dayLabelComponent** (optional): Will be rendered inside the day component, is responsible for rendering (or not) the days number.
 * **onDayClick** (optional): A function that will be called whenever a day is clicked, it's passed two variables, the event and a `momentjs` date.  Hours/Minutes are added to the date to reflect how far down the Y axis was clicked
 * **onEventClick** (optional): A function that will be called whenever an event is clicked, it's passed two variables, the event and the layout information for the event.  The layout has an `event` subkey that includes the event itself.


### Development

- `npm start` starts up a local development webserver which rebuilds files when changed
- `npm test` runs unit tests
- `npm run build` compiles files in preparation for publishing
