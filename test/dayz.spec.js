import React from 'react'; // eslint-disable-line no-unused-vars
import renderer from 'react-test-renderer';
import moment from '../src/moment-range';
import Dayz from '../src/dayz';

describe('Dayz', () => {
    let date;
    beforeEach(() => {
        date = moment('2015-09-12');
    });

    it('matches snapshot for month', () => {
        const dayz = renderer.create(<Dayz display='month' date={date} />);
        expect(dayz.toJSON()).toMatchSnapshot();
        dayz.unmount();
    });

    it('matches snapshot for week', () => {
        const dayz = renderer.create(<Dayz display='week' date={date} />);
        expect(dayz.toJSON()).toMatchSnapshot();
        dayz.unmount();
    });

    it('matches snapshot for day', () => {
        expect(
            renderer.create(<Dayz display='day' date={date} />).toJSON(),
        ).toMatchSnapshot();
    });

    it('renders highlights', () => {
        const dayz = renderer.create(
            <Dayz
                display='month' date={date}
                highlightDays={ ['2015-09-04', '2015-09-05'] }
            />,
        );
        expect(dayz.toJSON()).toMatchSnapshot();
        dayz.unmount();
    });

    it('sets events on day elements', () => {
        const handlers = { onClick: jest.fn(), onMouseOver: jest.fn() };
        const dayz = mount(
            <Dayz display='month' date={date} dayEventHandlers={handlers} />,
        );
        dayz.find('.day').at(0).simulate('click');
        expect(handlers.onClick).toHaveBeenCalled();
        dayz.find('.day').last().simulate('mouseOver');
        expect(handlers.onMouseOver).toHaveBeenCalled();
        dayz.unmount();
    });

    it('limits days to min/max displayed', () => {
        const day = moment('2018-11-14');
        const events = new Dayz.EventsCollection([{
            content: 'allmost all day',
            className: 'a-test-day',
            range: moment.range(
                day.clone().hours(1), day.clone().hours(23),
            ),
        }]);
        const dayz = mount(
            <Dayz displayHours={[6, 22]} display='week' date={day} events={events} />,
        );
        expect(dayz.debug()).toMatchSnapshot();
        const { style } = dayz.find('[data-date="20181114"] .event').props();
        expect(style.top).toEqual('0.00%');
        expect(style.bottom).toEqual('0.00%');
    });

    it('localizes to specified locale', () => {
        const dayz = renderer.create(<Dayz display='month' date={date} locale='de' />);
        expect(dayz.toJSON()).toMatchSnapshot();
        dayz.unmount();
    });
});
