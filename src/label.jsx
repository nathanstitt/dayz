import React from 'react'

const Label = React.createClass({

    propTypes: {
        day: React.PropTypes.object.isRequired
    },

    render() {
        return (
            <div className="label">{this.props.day.format('D')}</div>
        )
    }

})

export default Label
