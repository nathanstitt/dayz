var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import Emitter from 'tiny-emitter';
import Event from './event';

var lc = function lc(event) {
    return event.attributes.range.start.diff(event.attributes.range.end);
};

var sortEvents = function sortEvents(eventA, eventB) {
    var a = lc(eventA);
    var b = lc(eventB);
    return a < b ? -1 : a > b ? 1 : 0; // eslint-disable-line no-nested-ternary
};

var EventsCollection = function () {
    function EventsCollection() {
        var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _classCallCheck(this, EventsCollection);

        this.events = [];
        for (var i = 0, length = events.length; i < length; i += 1) {
            this.add(events[i], { silent: true });
        }
    }

    _createClass(EventsCollection, [{
        key: 'add',
        value: function add(eventAttrs) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var event = eventAttrs instanceof Event ? eventAttrs : new Event(eventAttrs);
            event.collection = this;
            this.events.push(event);
            if (!options.silent) {
                this.emit('change');
            }
            return event;
        }
    }, {
        key: 'forEach',
        value: function forEach(fn) {
            this.events.sort(sortEvents).forEach(fn);
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
export default EventsCollection;


Object.assign(EventsCollection.prototype, Emitter.prototype);