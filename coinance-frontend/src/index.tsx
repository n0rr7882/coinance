import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Root from './Root';

ReactDOM.render(<Root />, document.getElementById('root'));

document.documentElement.addEventListener('touchstart', e => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, false);
