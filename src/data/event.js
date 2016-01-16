const React   = require('react');
const assign  = require('lodash/object/assign');
const Emitter = require('tiny-emitter');

let EVENT_COUNTER = 1;

class Event {

    constructor( attributes ) {
        this.attributes = attributes;
        this.isEvent = true;
        this.key = EVENT_COUNTER++;
        if (!this.attributes.range){
            throw new Error("Must provide range");
        }
        if (!this.attributes.colorIndex){
            this.attributes.colorIndex = (EVENT_COUNTER % 10) + 1;
        }
    }

    render(date, layout){
        if (this.attributes.render){
            return this.attributes.render(date, layout);
        } else {
            return this.defaultRenderImplementation(date, layout);
        }
    }

    defaultRenderImplementation() {
        return React.createElement('div', {},
            this.attributes.content || this.attributes.range.start.format('MMM DD YYYY')
        );
    }

    get(key) {
        return this.attributes[key];
    }

    set(attributes, options) {
        assign(this.attributes, attributes);
        if (this.collection){
            this.collection.emit('change');
        }
        if (!options || !options.silent){
            this.emit('change');
        }
    }

    isEditing() {
        return !!this.attributes.editing;
    }

    range() {
        return this.attributes.range.clone();
    }

    isSingleDay() {
        return this.attributes.range.end.diff(this.attributes.range.start, 'hours') <= 24;
    }

    daysMinuteRange() {
        const startOfDay = this.attributes.range.start.clone().startOf('day');
        return {start: this.attributes.range.start.diff(startOfDay, 'minute'),
                end: this.attributes.range.end.diff(startOfDay, 'minute') };
    }

    content() {
        return this.attributes.content;
    }

    start() {
        return this.attributes.range.start;
    }

    end() {
        return this.attributes.range.end;
    }

    colorIndex() {
        return this.attributes.colorIndex;
    }

    remove() {
        this.collection.remove(this);
        this.isDeleted = true;
        this.emit('change');
    }
}

assign( Event.prototype, Emitter.prototype );

module.exports = Event;
