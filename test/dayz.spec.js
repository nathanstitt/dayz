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
        expect(
            renderer.create(<Dayz display='month' date={date} />).toJSON(),
        );
    });

    it('matches snapshot for week', () => {
        expect(
            renderer.create(<Dayz display='week' date={date} />).toJSON(),
        );
    });

    it('matches snapshot for day', () => {
        expect(
            renderer.create(<Dayz display='day' date={date} />).toJSON(),
        );
    });
});
