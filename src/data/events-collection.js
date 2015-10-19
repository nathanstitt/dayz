import Event   from './event'
import each    from 'lodash/collection/each'
import values  from 'lodash/object/values'
import flatten from 'lodash/array/flatten'
import sortBy from 'lodash/collection/sortby'

function cacheKey(date){ return date.format('YYYYMMDD'); }


function lengthCompare(event){
    return event.attributes.range.start.diff(event.attributes.range.end);
}

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
        each(sortBy(this.events, lengthCompare), fn, scope);
    }

    length(){
        return this.events.length;
    }
}

export default EventsCollection;
