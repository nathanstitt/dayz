var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import React from 'react';
import Emitter from 'tiny-emitter';

var EVENT_COUNTER = 1;

var Event = function () {
    function Event(attributes) {
        _classCallCheck(this, Event);

        this.attributes = attributes;
        this.isEvent = true;
        EVENT_COUNTER += 1;
        this.key = EVENT_COUNTER;
        if (!this.attributes.range) {
            throw new Error('Must provide range');
        }
    }

    _createClass(Event, [{
        key: 'render',
        value: function render(date, layout) {
            if (this.attributes.render) {
                return this.attributes.render(date, layout);
            }
            return this.defaultRenderImplementation(date, layout);
        }
    }, {
        key: 'defaultRenderImplementation',
        value: function defaultRenderImplementation() {
            return React.createElement('div', {}, this.attributes.content || this.attributes.range.start.format('MMM DD YYYY'));
        }
    }, {
        key: 'get',
        value: function get(key) {
            return this.attributes[key];
        }
    }, {
        key: 'set',
        value: function set(attributes, options) {
            var changed = false;
            for (var key in attributes) {
                // eslint-disable-line no-restricted-syntax
                if (this.attributes[key] !== attributes[key]) {
                    changed = true;
                    break;
                }
            }
            if (!changed) {
                return;
            }

            Object.assign(this.attributes, attributes);
            this.emitChangeEvent(options);
        }
    }, {
        key: 'isEditing',
        value: function isEditing() {
            return !!this.attributes.editing;
        }
    }, {
        key: 'setEditing',
        value: function setEditing(isEditing) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            if (isEditing !== this.isEditing()) {
                this.attributes.editing = isEditing;
            }
            this.emitChangeEvent(options);
        }
    }, {
        key: 'emitChangeEvent',
        value: function emitChangeEvent() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            if (this.collection) {
                this.collection.emit('change', this);
            }
            if (!options || !options.silent) {
                this.emit('change', this);
            }
        }
    }, {
        key: 'range',
        value: function range() {
            return this.attributes.range.clone();
        }
    }, {
        key: 'isSingleDay',
        value: function isSingleDay() {
            return 24 > this.attributes.range.end.diff(this.attributes.range.start, 'hours');
        }
    }, {
        key: 'daysMinuteRange',
        value: function daysMinuteRange() {
            var startOfDay = this.attributes.range.start.clone().startOf('day');
            return { start: this.attributes.range.start.diff(startOfDay, 'minute'),
                end: this.attributes.range.end.diff(startOfDay, 'minute') };
        }
    }, {
        key: 'content',
        value: function content() {
            return this.attributes.content;
        }
    }, {
        key: 'start',
        value: function start() {
            return this.attributes.range.start;
        }
    }, {
        key: 'end',
        value: function end() {
            return this.attributes.range.end;
        }
    }, {
        key: 'colorIndex',
        value: function colorIndex() {
            return this.attributes.colorIndex;
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.collection.remove(this);
            this.isDeleted = true;
            this.emit('change');
        }
    }]);

    return Event;
}();

Object.assign(Event.prototype, Emitter.prototype);

module.exports = Event;