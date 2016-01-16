## A day/week/monthly calendar component for React

[![Build Status](https://travis-ci.org/nathanstitt/dayz.svg?branch=master)](https://travis-ci.org/nathanstitt/dayz)

## Features
* Only includes the minimal amount of features needed.
    * For instance there's no paging controls provided, since they can easily be implemented outside the component.  This allows Dayz to be used both as a traditional next/previous month calendar or as part of a scrolling infinite view.
* Modern styling and layout
    * Uses flexbox layout (no tables)
        *  Currently is IE 11+ only.  IE 10 could be supported if someone wants to lookup the `-ms` flexbox vendor prefixes.  (PR's welcome).
    * All heights/widths are specified as percentages so the component will size to fit whatever container it's rendered into.
    * Styles are written in `scss` with variables that can be modified for customized builds.
* Care is taken to retain elements when switching view types, this allows minimal DOM reflow and allows nice animation effects where events warp into position.

Pre version `1.0.0` breaking changes will happen on the `minor` version while feature and patches accompany a patch bump.

![alt tag](http://nathan.stitt.org/images/dayz-weekly-screenshot.png)

## Demo

An interactive demo can be viewed at: http://nathan.stitt.org/dayz/


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

 * **date** (required):     An `momentjs` instance that controls what range is displayed. The calendar will automatically calculate the month or week that contains this date and display the appropriate range.
 * **events** (optional):  An `Dayz.EventsCollection` instance that contains events that should be displayed on the calendar.
 * **display** (optional, defaults to 'month'):  One of month, week, or day.
 * **onDayClick**, **onDayDoubleClick** (optional): A function that will be called whenever a day is clicked, it's passed two variables, the event and a `momentjs` date.  Hours/Minutes are added to the date to reflect how far down the Y axis was clicked
 * **onEventClick**, **onEventDoubleClick** (optional): A function that will be called whenever an event is clicked, it's passed two variables, the event and the layout information for the event.  The layout has an `event` subkey that includes the event itself.
 * **displayHours** (optional): defaults to 7am to 7pm or the earliest/latest event's hour.


### Development

- `npm start` starts up a local development web-server which rebuilds files when changed
- `npm test` runs unit tests
- `npm run build` compiles files in preparation for publishing
