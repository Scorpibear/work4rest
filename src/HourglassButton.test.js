import React from 'react';
import ReactDOM from 'react-dom';
import HourglassButton from './HourglassButton';

it('HourglassButton is rendered without errors', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HourglassButton />, div);
});