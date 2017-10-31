import Event from './event';

const Emitter = require('tiny-emitter');

const lc = event =>
    event.attributes.range.start.diff(event.attributes.range.end);

const sortEvents = (eventA, eventB) => {
    const a = lc(eventA);
    const b = lc(eventB);
    return a < b ? -1 : a > b ? 1 : 0; // eslint-disable-line no-nested-ternary
};

export default class EventsCollection {

    static Event = Event;

    constructor(events = []) {
        this.events = [];
        for (let i = 0, { length } = events; i < length; i += 1) {
            this.add(events[i], { silent: true });
        }
    }

    add(eventAttrs, options = {}) {
        const event = (eventAttrs instanceof Event) ? eventAttrs : new Event(eventAttrs);
        event.collection = this;
        this.events.push(event);
        if (!options.silent) {
            this.emit('change');
        }
        return event;
    }

    forEach(fn) {
        this.events.sort(sortEvents).forEach(fn);
    }

    length() {
        return this.events.length;
    }

    remove(event) {
        const index = this.events.indexOf(event);
        if (-1 !== index) {
            this.events.splice(index, 1);
            this.emit('change');
        }
    }

}

Object.assign(EventsCollection.prototype, Emitter.prototype);
