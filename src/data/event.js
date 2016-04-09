const React   = require('react');
const assign  = require('lodash/assign');
const each    = require('lodash/each');
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
        let changed = false;
        each(attributes, (value, key) =>{
            if (this.attributes[key] !== value){
                changed = true;
                return false;
            }
        });
        if (!changed){
            return;
        }
        assign(this.attributes, attributes);
        this._emitChangeEvent(options);
    }

    isEditing() {
        return !!this.attributes.editing;
    }

    setEditing(isEditing, options = {}) {
        if (isEditing !== this.isEditing()){
            this.attributes.editing = isEditing;
        }
        this._emitChangeEvent(options);
    }

    _emitChangeEvent(options = {}){
        if (this.collection) {
            this.collection.emit('change', this);
        }
        if (!options || !options.silent) {
            this.emit('change', this);
        }
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
