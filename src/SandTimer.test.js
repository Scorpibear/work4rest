import React from 'react';
import ReactDOM from 'react-dom';
import SandTimer from './SandTimer';

it('SandTimer starts without errors', () => {
  let sandTimer = new SandTimer();
  sandTimer.init();
  sandTimer.start();
});
