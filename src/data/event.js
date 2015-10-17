import React from 'react';
import range from 'moment-range';

let EVENT_COUNTER = 1;

class Event {

    constructor( attributes ) {
        this.attributes = attributes;
        this.isEvent = true;
        this.key = EVENT_COUNTER++;

        if (!this.attributes.range){
            throw new Error("Must provide range");
        }
    }

    render(date, layout){
        if (this.attributes.render){
            return this.attributes.render(date, layout);
        } else {
            return this.defaultRenderImplementation(date, layout);
        }
    }

    defaultRenderImplementation(date, options) {
        return React.createElement('div', {}, this.attributes.content || range.start.format('MMM DD YYYY') );
    }

    range() {
        return this.attributes.range.clone();
    }

    isMultiDay() {
        this.attributes.range.end.diff(this.range.start, 'days') > 1
    }

    content() {
        return this.attributes.content;
    }
}

export default Event;
