import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

const Label = ({ day }) => (
    <div className="label">{day.format('D')}</div>
);

Label.propTypes = {
    day: PropTypes.object.isRequired,
};


export default Label;
