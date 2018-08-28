import React from 'react'; // eslint-disable-line no-unused-vars
import { mount } from 'enzyme';
import moment from '../src/moment-range';
import Event from '../src/api/event';
import Layout from '../src/api/layout';
import EventComp from '../src/event';
import EventLayout from '../src/api/event-layout';
import EventsCollection from '../src/api/events-collection';

describe('Dayz', () => {
    let date;

    beforeEach(() => {
        date = moment('2015-09-12');
    });

    it('renders a single-day event', () => {
        const eventModel = new Event({
            content: 'test',
            range: moment.range(date.clone().add(8, 'hours'), date.clone().add(10, 'hours')),
        });
        const events = new EventsCollection([eventModel]);
        const layout = new Layout({
            events,
            display: 'day',
            day: date,
            range: moment.range(moment(date), moment(date).endOf('day')),
        });
        const eventLayout = new EventLayout(layout,
            eventModel,
            moment.range(date, date.clone().add(1, 'day')));
        const event  = mount(<EventComp layout={eventLayout} />);
        const style = event.find('.event').prop('style');
        const classList = event.find('.event').prop('className');
        expect(style.top).toEqual('7.69%');
        expect(style.bottom).toEqual('76.92%');
        expect(classList).toContain('event');
        expect(classList).toContain('span-1');
    });

    it('renders a multi-day event', () => {
        const eventModel = new Event({
            content: 'test',
            range: moment.range(date.clone(), date.clone().add(3, 'days')),
        });
        const events = new EventsCollection([eventModel]);
        const layout = new Layout({
            events,
            display: 'day',
            day: date,
            range: moment.range(moment(date), moment(date).endOf('day')),
        });
        const eventLayout = new EventLayout(layout,
            eventModel,
            moment.range(date, date.clone().add(1, 'day')));
        const event = mount(<EventComp layout={eventLayout} />);
        expect(eventModel.isSingleDay()).toBe(false);
        const style = event.find('.event').prop('style');
        const classList = event.find('.event').prop('className');
        expect(style).toEqual({});
        expect(classList).toContain('event');
        expect(classList).toContain('span-1');
        expect(classList).toContain('is-continued');
    });
});
