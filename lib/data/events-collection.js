'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Event = require('./event');
var Emitter = require('tiny-emitter');
var _each = require('lodash/each');
var assign = require('lodash/assign');
var sortBy = require('lodash/sortBy');

function lengthCompare(event) {
    return event.attributes.range.start.diff(event.attributes.range.end);
}

var EventsCollection = function () {
    function EventsCollection() {
        var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _classCallCheck(this, EventsCollection);

        this.events = [];
        for (var i = 0, length = events.length; i < length; i++) {
            this.add(events[i]);
        }
    }

    _createClass(EventsCollection, [{
        key: 'add',
        value: function add(event) {
            if (!event.isEvent) {
                event = new Event(event);
            }
            event.collection = this;
            this.events.push(event);
            this.emit('change');
            return event;
        }
    }, {
        key: 'each',
        value: function each(fn, scope) {
            var sorted = sortBy(this.events, lengthCompare);
            _each(sorted, fn, scope);
        }
    }, {
        key: 'length',
        value: function length() {
            return this.events.length;
        }
    }, {
        key: 'remove',
        value: function remove(event) {
            var index = this.events.indexOf(event);
            if (-1 !== index) {
                this.events.splice(index, 1);
                this.emit('change');
            }
        }
    }]);

    return EventsCollection;
}();

EventsCollection.Event = Event;


assign(EventsCollection.prototype, Emitter.prototype);

module.exports = EventsCollection;