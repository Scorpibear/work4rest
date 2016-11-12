import React from 'react';
import ReactDOM from 'react-dom';
import Hourglass from './Hourglass';

it('Hourglass is rendered without errors', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Hourglass />, div);
});
