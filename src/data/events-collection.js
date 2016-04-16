const Event   = require('./event');
const Emitter = require('tiny-emitter');
const each    = require('lodash/each');
const assign  = require('lodash/assign');
const sortBy  = require('lodash/sortBy');

function lengthCompare(event){
    return event.attributes.range.start.diff(event.attributes.range.end);
}

class EventsCollection {
    static Event = Event;

    constructor(events = []) {
        this.events = [];
        for (let i = 0, length = events.length; i<length; i++) {
            this.add(events[i]);
        }
    }

    add(event) {
        if (!event.isEvent){
            event = new Event(event);
        }
        event.collection = this;
        this.events.push(event);
        this.emit('change');
        return event;
    }

    each(fn, scope) {
        var sorted = sortBy(this.events, lengthCompare);
        each(sorted, fn, scope);
    }

    length() {
        return this.events.length;
    }

    remove(event){
        const index = this.events.indexOf(event);
        if (-1 !== index){
            this.events.splice(index, 1);
            this.emit('change');
        }
    }
}

assign( EventsCollection.prototype, Emitter.prototype );

module.exports = EventsCollection;
