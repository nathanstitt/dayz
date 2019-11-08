import Event from './event';
import moment from '../moment-range';

const Emitter = require('tiny-emitter');

const lc = event => event.attributes.range.start.diff(event.attributes.range.end);

const sortEvents = (eventA, eventB) => {
    const a = lc(eventA);
    const b = lc(eventB);
    return a < b ? -1 : a > b ? 1 : 0; // eslint-disable-line no-nested-ternary
};

export default class EventsCollection {

    static Event = Event;

    constructor(events = [], options = { displayAllDay: true, displayLabelForAllDays: true }) {
        this.events = [];
        for (let i = 0, { length } = events; i < length; i += 1) {
            if (options.displayAllDay) {
                this.add(events[i], { silent: true });
            } else {
                Array.from(events[i].range.snapTo('days').by('day')).map((date, j) => {
                    if (false === options.displayLabelForAllDays && j > 0) {
                        events[i].content = ' ';
                    }
                    return this.add(events[i], { silent: true, eventDay: date.clone() });
                });
            }
        }
    }

    add(eventAttrs, options = {}) {
        const attrs = this.prepareEventAttributes(eventAttrs, options.eventDay);
        const event = (eventAttrs instanceof Event) ? eventAttrs : new Event(attrs);
        event.collection = this;
        this.events.push(event);
        if (!options.silent) {
            this.emit('change');
        }
        return event;
    }

    prepareEventAttributes(eventAttrs, eventDay) {
        if (eventDay === undefined) {
            return eventAttrs;
        }

        const attrs = { ...eventAttrs };
        const rangeEnd = moment.min(attrs.range.end, eventDay.endOf('day')).toDate();
        const rangeStart = moment.max(attrs.range.start, eventDay.startOf('day')).toDate();
        const range = { range: moment.range(rangeStart, rangeEnd) };

        return { ...attrs, ...range };
    }

    forEach(fn) {
        this.events.sort(sortEvents).forEach(fn);
    }

    get length() {
        return this.events.length;
    }

    at(i) {
        return this.events[i];
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
