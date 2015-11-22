'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

var _tinyEmitter = require('tiny-emitter');

var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

var _each2 = require('lodash/collection/each');

var _each3 = _interopRequireDefault(_each2);

var _assign = require('lodash/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _sortBy = require('lodash/collection/sortBy');

var _sortBy2 = _interopRequireDefault(_sortBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function lengthCompare(event) {
    return event.attributes.range.start.diff(event.attributes.range.end);
}

var EventsCollection = (function () {
    function EventsCollection() {
        var events = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

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
                event = new _event2.default(event);
            }
            event.collection = this;
            this.events.push(event);
            this.emit('change');
            return event;
        }
    }, {
        key: 'each',
        value: function each(fn, scope) {
            (0, _each3.default)((0, _sortBy2.default)(this.events, lengthCompare), fn, scope);
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
})();

EventsCollection.Event = _event2.default;

(0, _assign2.default)(EventsCollection.prototype, _tinyEmitter2.default.prototype);

exports.default = EventsCollection;