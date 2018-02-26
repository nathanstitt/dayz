import React from 'react';

const Emitter = require('tiny-emitter');

let EVENT_COUNTER = 1;

export default class Event {

    constructor(attributes) {
        this.attributes = attributes;
        this.isEvent = true;
        EVENT_COUNTER += 1;
        this.key = EVENT_COUNTER;
        if (!this.attributes.range) {
            throw new Error('Must provide range');
        }
    }

    render(date, layout) {
        if (this.attributes.render) {
            return this.attributes.render(date, layout);
        }
        return this.defaultRenderImplementation(date, layout);
    }

    defaultRenderImplementation() {
        return React.createElement(
            'div',
            {},
            this.attributes.content || this.attributes.range.start.format('MMM DD YYYY'),
        );
    }

    get(key) {
        return this.attributes[key];
    }

    set(attributes, options) {
        let changed = false;
        for (const key in attributes) { // eslint-disable-line no-restricted-syntax
            if (this.attributes[key] !== attributes[key]) {
                changed = true;
                break;
            }
        }
        if (!changed) { return; }

        Object.assign(this.attributes, attributes);
        this.emitChangeEvent(options);
    }

    isEditing() {
        return !!this.attributes.editing;
    }

    setEditing(isEditing, options = {}) {
        if (isEditing !== this.isEditing()) {
            this.attributes.editing = isEditing;
        }
        this.emitChangeEvent(options);
    }

    emitChangeEvent(options = {}) {
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
        return 24 > this.attributes.range.end.diff(this.attributes.range.start, 'hours');
    }

    daysMinuteRange() {
        const startOfDay = this.attributes.range.start.clone().startOf('day');
        return {
            start: this.attributes.range.start.diff(startOfDay, 'minute'),
            end: this.attributes.range.end.diff(startOfDay, 'minute'),
        };
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
        return this.attributes.colorIndex || 0;
    }

    remove() {
        this.collection.remove(this);
        this.isDeleted = true;
        this.emit('change');
    }

}

Object.assign(Event.prototype, Emitter.prototype);
