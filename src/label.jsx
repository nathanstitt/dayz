import React from 'react';
import Layout from './data/layout';

const Label = React.createClass({

    propTypes: {
        day: React.PropTypes.object.isRequired
    },

    render() {
        return (
            <div className="label">{this.props.day.format('D')}</div>
        );
    }

});


export default Label;
