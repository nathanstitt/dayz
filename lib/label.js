import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

var Label = function Label(_ref) {
    var day = _ref.day;
    return React.createElement(
        'div',
        { className: 'label' },
        day.format('D')
    );
};

Label.propTypes = {
    day: PropTypes.object.isRequired
};

export default Label;