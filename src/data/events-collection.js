import Event   from './event'
import each    from 'lodash/collection/each'
import values  from 'lodash/object/values'
import flatten from 'lodash/array/flatten'

function cacheKey(date){ return date.format('YYYYMMDD'); }

class EventsCollection {
    static Event = Event

    constructor(events=[]) {
        this.events = []
        for (let i = 0, length = events.length; i<length; i++){
            this.add(events[i]);
        }
    }

    add(event) {
        // console.log("Add event: ", event);
        if (!event.isEvent){
            event = new Event(event);
        }
        this.events.push(event);
    }

    each(fn, scope){
        each(this.events, fn, scope);
    }

    length(){
        return this.events.length;
    }
}

export default EventsCollection;
