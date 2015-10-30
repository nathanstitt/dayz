import Event   from './event';
import Emitter from 'tiny-emitter';
import each    from 'lodash/collection/each';
import values  from 'lodash/object/values';
import flatten from 'lodash/array/flatten';
import assign  from 'lodash/object/assign';
import sortBy  from 'lodash/collection/sortby';

function lengthCompare(event){
    return event.attributes.range.start.diff(event.attributes.range.end);
}

class EventsCollection {
    static Event = Event

    constructor(events = []) {
        this.events  = [];
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
        each(sortBy(this.events, lengthCompare), fn, scope);
    }

    length() {
        return this.events.length;
    }
}

assign( EventsCollection.prototype, Emitter.prototype )

export default EventsCollection;
