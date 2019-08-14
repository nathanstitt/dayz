(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('moment-range'), require('react-dom'), require('moment'), require('react'), require('prop-types')) :
  typeof define === 'function' && define.amd ? define(['moment-range', 'react-dom', 'moment', 'react', 'prop-types'], factory) :
  (global.dayz = factory(global['moment-range'],global.ReactDOM,global.moment,global.React,global.PropTypes));
}(this, (function (momentRange,ReactDOM,moment,React,PropTypes) { 'use strict';

  ReactDOM = ReactDOM && ReactDOM.hasOwnProperty('default') ? ReactDOM['default'] : ReactDOM;
  moment = moment && moment.hasOwnProperty('default') ? moment['default'] : moment;
  React = React && React.hasOwnProperty('default') ? React['default'] : React;
  PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  const moment$1 = require('moment'); // an event duration describes how an event is displayed.
  // A event may be split into one or more durations in order to be split across week boundaries


  class EventDuration {
    constructor(layout, event, displayRange) {
      this.layout = layout;
      this.event = event;
      this.stack = 0;
      this.displayRange = displayRange;
      this.startsBefore = event.start.isBefore(displayRange.start);
      this.endsAfter = event.end.isAfter(displayRange.end);

      if (this.layout.isDisplayingAsMonth) {
        this.range = moment$1.range(moment$1.max(displayRange.start, event.start.startOf('day')), moment$1.min(displayRange.end, event.end.endOf('day')));
      } else {
        this.range = moment$1.range(moment$1.max(displayRange.start, event.start), moment$1.min(displayRange.end, event.end));
      }

      this.span = Math.max(1, Math.ceil(this.range.end.diff(this.range.start, 'day', true)));
    }

    isEditing() {
      return this.first && this.event.isEditing();
    }

    startsOnWeek() {
      return 0 === this.event.start.weekday();
    }

    adjustEventTime(startOrEnd, position, height) {
      if (position < 0 || position > height) {
        return;
      }

      const time = this.event[startOrEnd].startOf('day').add(this.layout.displayHours[0], 'hours').add(this.layout.minutesInDay() * (position / height), 'minutes');

      const _this$event$get = this.event.get('resizable'),
            step = _this$event$get.step;

      if (step) {
        const rounded = Math.round(time.minute() / step) * step;
        time.minute(rounded).second(0);
      }

      this.event.emit('change');
    }

    inlineStyles() {
      if ('month' === this.layout.displayingAs() || !this.event.isSingleDay()) {
        return {};
      }

      let _this$event$daysMinut = this.event.daysMinuteRange(),
          start = _this$event$daysMinut.start,
          end = _this$event$daysMinut.end;

      const startOffset = this.layout.displayHours[0] * 60;
      const endOffset = this.layout.displayHours[1] * 60;
      start = Math.max(start - startOffset, 0);
      end = Math.min(end, endOffset) - startOffset;
      const inday = this.layout.minutesInDay();
      const top = `${(start / inday * 100).toFixed(2)}%`;
      const bottom = `${(100 - end / inday * 100).toFixed(2)}%`;
      return {
        top,
        bottom
      };
    }

    isResizable() {
      return this.layout.displayingAs() !== 'month' && this.event.get('resizable');
    }

    key() {
      return this.displayRange.start.format('YYYYMMDD') + this.event.key;
    }

    setIsResizing(val) {
      this.isResizing = val;
    }

    classNames() {
      const classes = ['event', `span-${this.span}`];

      if (this.event.colorIndex) {
        classes.push(`color-${this.event.colorIndex}`);
      }

      if (this.isResizing) classes.push('is-resizing');
      if (this.startsBefore) classes.push('is-continuation');
      if (this.endsAfter) classes.push('is-continued');
      if (this.stack) classes.push(`stack-${this.stack}`);
      if (this.isEditing()) classes.push('is-editing');
      if (this.isResizable()) classes.push('is-resizable');

      if (this.event.className) {
        classes.push(this.event.className);
      }

      return classes.join(' ');
    }

  }

  var C = {
    eventHeight: 20 // px

  };

  const moment$2 = momentRange.extendMoment(moment);

  const Emitter = require('tiny-emitter');

  let EVENT_COUNTER = 1;
  class Event {
    constructor(attributes) {
      this.attributes = attributes;
      this.isEvent = true;
      EVENT_COUNTER += 1;
      this.key = EVENT_COUNTER;

      if (!this.attributes.range) {
        throw new Error('Must provide range');
      }
    }

    render() {
      if (this.attributes.render) {
        return this.attributes.render({
          event: this
        });
      }

      return this.defaultRenderImplementation();
    }

    defaultRenderImplementation() {
      return React.createElement('div', {}, this.attributes.content || this.attributes.range.start.format('MMM DD YYYY'));
    }

    get(key) {
      return this.attributes[key];
    }

    set(attributes, options) {
      let changed = false;

      for (const key in attributes) {
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

    isEditing() {
      return !!this.attributes.editing;
    }

    setEditing(isEditing) {
      let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (isEditing !== this.isEditing()) {
        this.attributes.editing = isEditing;
      }

      this.emitChangeEvent(options);
    }

    emitChangeEvent() {
      let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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
        end: this.attributes.range.end.diff(startOfDay, 'minute')
      };
    }

    get content() {
      return this.attributes.content;
    }

    get start() {
      return this.attributes.range.start;
    }

    get end() {
      return this.attributes.range.end;
    }

    get colorIndex() {
      return this.attributes.colorIndex || 0;
    }

    get className() {
      return this.attributes.className || '';
    }

    remove() {
      this.collection.remove(this);
      this.isDeleted = true;
      this.emit('change');
    }

  }
  Object.assign(Event.prototype, Emitter.prototype);

  const Emitter$1 = require('tiny-emitter');

  const lc = event => event.attributes.range.start.diff(event.attributes.range.end);

  const sortEvents = (eventA, eventB) => {
    const a = lc(eventA);
    const b = lc(eventB);
    return a < b ? -1 : a > b ? 1 : 0; // eslint-disable-line no-nested-ternary
  };

  class EventsCollection {
    constructor() {
      let events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      this.events = [];

      for (let i = 0, length = events.length; i < length; i += 1) {
        this.add(events[i], {
          silent: true
        });
      }
    }

    add(eventAttrs) {
      let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      const event = eventAttrs instanceof Event ? eventAttrs : new Event(eventAttrs);
      event.collection = this;
      this.events.push(event);

      if (!options.silent) {
        this.emit('change');
      }

      return event;
    }

    forEach(fn) {
      this.events.sort(sortEvents).forEach(fn);
    }

    get length() {
      return this.events.length;
    }

    at(i) {
      return this.events[i];
    }

    remove(event) {
      const index = this.events.indexOf(event);

      if (-1 !== index) {
        this.events.splice(index, 1);
        this.emit('change');
      }
    }

  }
  EventsCollection.Event = Event;
  Object.assign(EventsCollection.prototype, Emitter$1.prototype);

  function cacheKey(day) {
    return day.format('YYYYMMDD');
  }

  function highlightedDaysFinder(days) {
    const highlighted = Object.create(null);
    days.forEach(d => {
      highlighted[cacheKey(moment$2(d))] = true;
    });
    return day => highlighted[cacheKey(day)] ? 'highlight' : false;
  } // a layout describes how the calendar is displayed.


  class Layout {
    constructor(options) {
      this.cache = Object.create(null);
      options.date = moment$2(options.date);
      Object.assign(this, options);
      const cacheMethod = 'day' === this.display ? 'addtoDaysCache' : 'calculateDurations';
      this.calculateRange();

      if (!this.isDisplayingAsMonth && !this.displayHours) {
        this.displayHours = this.hourRange();
      } else {
        this.displayHours = this.displayHours || [0, 24];
      }

      if (options.highlightDays) {
        this.isDayHighlighted = 'function' === typeof options.highlightDays ? options.highlightDays : highlightedDaysFinder(options.highlightDays);
      }

      let multiDayCount = 0;

      if (!this.events) {
        this.events = new EventsCollection();
      }

      const range = this.range;
      this.events.forEach(event => {
        // we only care about events that are in the range we were provided
        if (range.overlaps(event.range())) {
          this[cacheMethod](event);

          if (!event.isSingleDay()) {
            multiDayCount += 1;
          }
        }
      });
      this.multiDayCount = multiDayCount;
      this.calculateStacking();
    }

    calculateRange() {
      if (this.range) {
        return;
      }

      this.range = moment$2.range(moment$2(this.date).startOf(this.display), moment$2(this.date).endOf(this.display));

      if (this.isDisplayingAsMonth) {
        this.range.start.subtract(this.range.start.weekday(), 'days');
        this.range.end.add(6 - this.range.end.weekday(), 'days');
      }
    }

    minutesInDay() {
      return (this.displayHours[1] - this.displayHours[0]) * 60;
    }

    propsForDayContainer(_ref) {
      let day = _ref.day,
          position = _ref.position;
      const classes = ['day'];
      const date = moment$2(day);

      if (moment$2(date).isBefore(this.date)) {
        classes.push('before');
      } else if (moment$2(date).isAfter(this.date)) {
        classes.push('after');
      } else {
        classes.push('current');
      }

      if (this.isDateOutsideRange(date)) {
        classes.push('outside');
      }

      const higlight = this.isDayHighlighted(date, this);

      if (higlight) {
        classes.push(higlight);
      }

      const handlers = {};
      Object.keys(this.dayEventHandlers || {}).forEach(k => {
        handlers[k] = ev => this.dayEventHandlers[k](date, ev);
      });
      return _objectSpread({
        className: classes.join(' '),
        'data-date': cacheKey(day),
        style: {
          order: position
        }
      }, handlers);
    }

    propsForAllDayEventContainer() {
      const style = this.multiDayCount ? {
        flexBasis: this.multiDayCount * C.eventHeight
      } : {
        display: 'none'
      };
      return {
        className: 'all-day',
        style
      };
    }

    hourRange() {
      const range = [7, 19];
      Array.from(this.range.by('days')).forEach(day => {
        this.forDay(day).forEach(duration => {
          range[0] = Math.min(duration.event.start.hour(), range[0]);
          range[1] = Math.max(duration.event.end.hour(), range[1]);
        });
      });
      range[1] += 1;
      return range;
    }

    getEventsForWeek(start) {
      const day = start.clone();
      const weeklyEvents = [];

      for (let i = 0; i < 7; i++) {
        const durations = this.forDay(day);

        for (let li = 0, length = durations.length; li < length; li += 1) {
          weeklyEvents.push(durations[li]);
        }

        day.add(1, 'day');
      }

      const minLong = range => moment$2.max(start, range.start).diff(moment$2.min(day, range.end), 'minutes');

      return weeklyEvents.sort((al, bl) => {
        const a = minLong(al.event.range());
        const b = minLong(bl.event.range());
        return a === b ? 0 : a > b ? 1 : -1; // eslint-disable-line no-nested-ternary
      });
    }

    calculateStacking() {
      const firstOfWeek = this.range.start.clone().startOf('week');

      do {
        const weeklyEvents = this.getEventsForWeek(firstOfWeek);

        for (let durationIndex = 0; durationIndex < weeklyEvents.length; durationIndex++) {
          const duration = weeklyEvents[durationIndex]; // loop through each duration that is before this one

          let ceilingIndex = 0;

          for (let pi = durationIndex - 1; pi >= 0; pi--) {
            const prevDuration = weeklyEvents[pi];

            if (prevDuration.range.start.isSame(duration.range.start, 'd')) {
              ceilingIndex = pi + 1;
              break;
            }
          }

          for (let pi = ceilingIndex; pi < durationIndex; pi++) {
            const prevDuration = weeklyEvents[pi];

            if (duration.range.overlaps(prevDuration.range)) {
              duration.stack += 1;
            }
          }
        }

        firstOfWeek.add(7, 'day');
      } while (!firstOfWeek.isAfter(this.range.end));
    } // This is the default implementation.
    // It will be overwritten if highlightDays option is provided


    isDayHighlighted() {
      return false;
    }

    isDateOutsideRange(date) {
      return this.isDisplayingAsMonth && !this.date.isSame(date, 'month');
    }

    forDay(day) {
      return this.cache[cacheKey(day)] || [];
    } // a single day is easy, just add the event to that day


    addtoDaysCache(event) {
      const duration = new EventDuration(this, event, this.range);
      this.addToCache(this.range.start, duration);
    } // other durations must break at week boundaries, with indicators if they were/are continuing


    calculateDurations(event) {
      const end = moment$2.min(this.range.end, event.range().end);
      const start = moment$2.max(this.range.start, event.range().start).clone();

      do {
        const range = moment$2.range(start, start.clone().endOf('week'));
        const duration = new EventDuration(this, event, range);
        this.addToCache(start, duration); // go to first day of next week

        start.add(7 - start.weekday(), 'day');
      } while (!start.isAfter(end));
    }

    addToCache(date, duration) {
      let found = false;

      for (const key in this.cache) {
        // eslint-disable-line no-restricted-syntax
        if (this.cache[key].event === duration.event) {
          found = true;
          break;
        }
      }

      if (!found) {
        duration.first = true; // eslint-disable-line no-param-reassign
      }

      const dayCache = this.cache[cacheKey(date)] || (this.cache[cacheKey(date)] = []);
      dayCache.push(duration);
    }

    displayingAs() {
      return this.display;
    }

    get isDisplayingAsMonth() {
      return 'month' === this.display;
    }

  }

  const IsResizeClass = new RegExp('(\\s|^)event(\\s|$)');
  class Event$1 extends React.Component {
    constructor(props) {
      super(props);
      ['onClick', 'onDoubleClick', 'onDoubleClick', 'onDragStart'].forEach(ev => {
        this[ev] = this[ev].bind(this);
      });
    }

    onClick(ev) {
      if (!this.props.onClick) {
        return;
      }

      this.props.onClick(ev, this.props.duration.event);
      ev.stopPropagation();
    }

    onDoubleClick(ev) {
      if (!this.props.onDoubleClick) {
        return;
      }

      this.props.onDoubleClick(ev, this.props.duration.event);
      ev.stopPropagation();
    }

    onDragStart(ev) {
      if (!IsResizeClass.test(ev.target.className)) {
        return;
      }

      const bounds = ReactDOM.findDOMNode(this.refs.element).getBoundingClientRect();
      let resize;

      if (ev.clientY - bounds.top < 10) {
        resize = {
          type: 'start'
        };
      } else if (bounds.bottom - ev.clientY < 10) {
        resize = {
          type: 'end'
        };
      } else {
        return;
      }

      this.props.onDragStart(resize, this.props.duration);
    }

    render() {
      const body = React.createElement("div", {
        className: "evbody",
        onClick: this.onClick
      }, this.props.duration.event.render());
      const Edit = this.props.editComponent;
      const children = this.props.duration.isEditing() ? React.createElement(Edit, {
        event: this.props.duration.event
      }, body) : body;
      return React.createElement("div", {
        ref: "element",
        onMouseDown: this.onDragStart,
        style: this.props.duration.inlineStyles(),
        className: this.props.duration.classNames()
      }, children);
    }

  }
  Event$1.propTypes = {
    duration: PropTypes.instanceOf(EventDuration),
    editComponent: PropTypes.func,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func
  };

  const Label = (_ref) => {
    let day = _ref.day;
    return React.createElement("div", {
      className: "label"
    }, day.format('D'));
  };

  Label.propTypes = {
    day: PropTypes.object.isRequired
  };

  const IsDayClass = new RegExp('(\\s|^)(events|day|label)(\\s|$)');
  class Day extends React.Component {
    constructor() {
      super();
      this.state = {
        resize: false
      };
      ['onClick', 'onDoubleClick', 'onMouseMove', 'onMouseUp', 'onDragStart'].forEach(ev => {
        this[ev] = this[ev].bind(this);
      });
    }

    get boundingBox() {
      return ReactDOM.findDOMNode(this.refs.events || this.refs.root).getBoundingClientRect();
    }

    onClickHandler(ev, handler) {
      if (!handler || !IsDayClass.test(ev.target.className) || this.lastMouseUp && this.lastMouseUp < new Date().getMilliseconds() + 100) {
        return;
      }

      this.lastMouseUp = 0;
      const bounds = this.boundingBox;
      const perc = Math.max(0.0, (ev.clientY - bounds.top) / ev.target.offsetHeight);
      const hours = this.props.layout.displayHours[0] + this.props.layout.minutesInDay() * perc / 60;
      handler.call(this, ev, this.props.day.clone().startOf('day').add(hours, 'hour'));
    }

    onClick(ev) {
      this.onClickHandler(ev, this.props.handlers.onClick);
    }

    onDoubleClick(ev) {
      this.onClickHandler(ev, this.props.handlers.onDoubleClick);
    }

    onDragStart(resize, eventLayout) {
      eventLayout.setIsResizing(true);
      const bounds = this.boundingBox;
      Object.assign(resize, {
        eventLayout,
        height: bounds.height,
        top: bounds.top
      });
      this.setState({
        resize
      });
    }

    onMouseMove(ev) {
      if (!this.state.resize) {
        return;
      }

      const coord = ev.clientY - this.state.resize.top;
      this.state.resize.eventLayout.adjustEventTime(this.state.resize.type, coord, this.state.resize.height);
      this.forceUpdate();
    }

    onMouseUp(ev) {
      if (!this.state.resize) {
        return;
      }

      this.state.resize.eventLayout.setIsResizing(false);
      setTimeout(() => this.setState({
        resize: false
      }), 1);

      if (this.props.onEventResize) {
        this.props.onEventResize(ev, this.state.resize.eventLayout.event);
      }

      this.lastMouseUp = new Date().getMilliseconds();
    }

    renderEvents() {
      const asMonth = this.props.layout.isDisplayingAsMonth;
      const singleDayEvents = [];
      const allDayEvents = [];
      const onMouseMove = asMonth ? null : this.onMouseMove;
      this.props.layout.forDay(this.props.day).forEach(duration => {
        const event = React.createElement(Event$1, {
          duration: duration,
          key: duration.key(),
          day: this.props.day,
          parent: this,
          onDragStart: this.onDragStart,
          onClick: this.props.onEventClick,
          editComponent: this.props.editComponent,
          onDoubleClick: this.props.onEventDoubleClick
        });
        (duration.event.isSingleDay() ? singleDayEvents : allDayEvents).push(event);
      });
      const events = [];

      if (allDayEvents.length || !asMonth) {
        events.push(React.createElement("div", _extends({
          key: "allday"
        }, this.props.layout.propsForAllDayEventContainer()), allDayEvents));
      }

      if (singleDayEvents.length) {
        events.push(React.createElement("div", {
          key: "events",
          ref: "events",
          className: "events",
          onMouseMove: onMouseMove,
          onMouseUp: this.onMouseUp
        }, singleDayEvents));
      }

      return events;
    }

    render() {
      const props = this.props.layout.propsForDayContainer(this.props);
      return React.createElement("div", _extends({
        ref: "root"
      }, props, {
        onClick: this.onClick,
        onDoubleClick: this.onDoubleClick
      }), React.createElement(Label, {
        day: this.props.day,
        className: "label"
      }, this.props.day.format('D')), this.renderEvents());
    }

  }
  Day.propTypes = {
    day: PropTypes.object.isRequired,
    layout: PropTypes.instanceOf(Layout).isRequired,
    handlers: PropTypes.object,
    position: PropTypes.number.isRequired,
    highlight: PropTypes.func,
    onEventClick: PropTypes.func,
    onEventResize: PropTypes.func,
    editComponent: PropTypes.func,
    onEventDoubleClick: PropTypes.func
  };
  Day.defaultProps = {
    handlers: {}
  };

  class XLabels extends React.Component {
    get days() {
      const days = [];

      if ('day' === this.props.display) {
        days.push(moment(this.props.date));
      } else {
        const day = moment(this.props.date).startOf('week');

        for (let i = 0; i < 7; i += 1) {
          days.push(day.clone().add(i, 'day'));
        }
      }

      return days;
    }

    render() {
      const format = 'month' === this.props.display ? 'dddd' : 'ddd, MMM Do';
      return React.createElement("div", {
        className: "x-labels"
      }, this.days.map(day => React.createElement("div", {
        key: day.format('YYYYMMDD'),
        className: "day-label"
      }, day.format(format))));
    }

  }
  XLabels.propTypes = {
    display: PropTypes.oneOf(['month', 'week', 'day']),
    date: PropTypes.object.isRequired
  };

  class YLabels extends React.Component {
    get hours() {
      const _this$props$layout$di = _slicedToArray(this.props.layout.displayHours, 2),
            start = _this$props$layout$di[0],
            end = _this$props$layout$di[1];

      return Array(end - start).fill().map((_, i) => i + start);
    }

    renderLabels() {
      const day = moment$2();
      return this.hours.map(hour => React.createElement("div", {
        key: hour,
        className: "hour"
      }, day.hour(hour).format(this.props.timeFormat)));
    }

    render() {
      if ('month' === this.props.display) {
        return null;
      }

      return React.createElement("div", null, React.createElement("div", {
        className: "y-labels"
      }, React.createElement("div", this.props.layout.propsForAllDayEventContainer(), "All Day"), this.renderLabels()));
    }

  }
  YLabels.propTypes = {
    display: PropTypes.oneOf(['month', 'week', 'day']).isRequired,
    date: PropTypes.object.isRequired,
    layout: PropTypes.instanceOf(Layout).isRequired,
    timeFormat: PropTypes.string
  };
  YLabels.defaultProps = {
    timeFormat: 'ha'
  };

  class Dayz extends React.Component {
    constructor(props) {
      super(props);
      this.layoutFromProps();
    }

    componentDidUpdate(prevProps) {
      // don't calculate layout if update is due to state change
      if (prevProps !== this.props) {
        this.layoutFromProps();
        this.forceUpdate();
      }
    }

    componentWillUnmount() {
      this.detachEventBindings();
    }

    detachEventBindings() {
      if (this.props.events) {
        this.props.events.off('change', this.onEventAdd);
      }
    }

    onEventsChange() {
      this.forceUpdate();
    }

    layoutFromProps() {
      const props = this.props;

      if (this.props && props.events) {
        this.detachEventBindings();
        props.events.on('change', this.onEventsChange, this);
      }

      this.layout = new Layout(Object.assign({}, props));
    }

    get days() {
      return Array.from(this.layout.range.by('days'));
    }

    renderDays() {
      return this.days.map((day, index) => React.createElement(Day, {
        key: day.format('YYYYMMDD'),
        day: day,
        position: index,
        layout: this.layout,
        editComponent: this.props.editComponent,
        handlers: this.props.dayEventHandlers,
        eventHandlers: this.props.eventHandlers,
        onEventClick: this.props.onEventClick,
        onEventResize: this.props.onEventResize
      }));
    }

    render() {
      const classes = ['dayz', this.props.display];
      return React.createElement("div", {
        className: classes.join(' ')
      }, React.createElement(XLabels, {
        date: this.props.date,
        display: this.props.display
      }), React.createElement("div", {
        className: "body"
      }, React.createElement(YLabels, {
        layout: this.layout,
        display: this.props.display,
        date: this.props.date,
        timeFormat: this.props.timeFormat
      }), React.createElement("div", {
        className: "days"
      }, this.renderDays(), this.props.children)));
    }

  }
  Dayz.EventsCollection = EventsCollection;
  Dayz.propTypes = {
    date: PropTypes.object.isRequired,
    events: PropTypes.instanceOf(EventsCollection),
    display: PropTypes.oneOf(['month', 'week', 'day']),
    timeFormat: PropTypes.string,
    displayHours: PropTypes.array,
    onEventClick: PropTypes.func,
    editComponent: PropTypes.func,
    onEventResize: PropTypes.func,
    dayEventHandlers: PropTypes.object,
    highlightDays: PropTypes.oneOfType([PropTypes.array, PropTypes.func])
  };
  Dayz.defaultProps = {
    display: 'month'
  };

  return Dayz;

})));
