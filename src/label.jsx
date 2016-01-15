const React = require('react');

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

module.exports = Label;
