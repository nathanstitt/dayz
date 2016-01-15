const ReactDOM = require('react-dom');
const React    = require('react');

const DayzTest = require('./test-component');

const div = document.createElement('div');
document.body.appendChild(div);
ReactDOM.render( React.createElement(DayzTest, {} ), div );
