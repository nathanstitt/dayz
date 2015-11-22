/*eslint no-console: 0*/

import ReactDOM from 'react-dom';
import React    from 'react';

import DayzTest from './test-component';

const div = document.createElement('div');
document.body.appendChild(div);
ReactDOM.render( React.createElement(DayzTest, {} ), div );
