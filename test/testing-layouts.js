import moment from '../src/moment-range';
import Layout from '../src/api/layout';
import EventsCollection from '../src/api/events-collection';
import Event from '../src/api/event';

export
const testEventRange = (startAtDate, endAtDate) => {
    const startAt = moment(startAtDate);
    const endAt = moment(endAtDate).endOf('day');
    const event  = new Event({ range: moment.range(moment(startAt), moment(endAt)) });
    const events = new EventsCollection([event]);
    const layout = new Layout({
        events,
        range: moment.range(event.range().start.startOf('month'),
            event.range().end.endOf('month')),
        display: 'month',
        day: startAt,
    });
    return { events, layout, event };
};

export
const testEventDay = (date, startAt, endAt) => {
    const events = new EventsCollection();
    const event  = events.add({ range: moment.range(moment(startAt), moment(endAt)) });
    const layout = new Layout({
        events,
        range: moment.range(moment(date), moment(date).endOf('day')),
        display: 'day',
        day: startAt,
    });

    return { events, layout, event };
};

export
const testEventMonth = (options = {}) => {
    const layout = new Layout(Object.assign({
        display: 'month',
        range: moment.range(
            '2018-10-28T13:00:00.000Z',
            '2018-12-01T13:00:00.000Z',
        ),
        events: new EventsCollection([
            {
                content: '3-day',
                range: moment.range(
                    '2018-11-14T13:00:00.000Z',
                    '2018-11-16T13:00:00.000Z',
                ),
            }, {
                content: '1-day',
                range: moment.range(
                    '2018-11-16T13:00:00.000Z',
                    '2018-11-16T13:00:00.000Z',
                ),
            }, {
                content: '1-day',
                range: moment.range(
                    '2018-11-16T13:00:00.000Z',
                    '2018-11-16T13:00:00.000Z',
                ),
            },
        ]),
    }, options));
    return layout;
};
