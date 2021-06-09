/** @jsx createElement */
/*** @jsxFrag createFragment */

import { createElement } from './element';
import { updateFocusState } from '../data/mediaData';
import { current } from './hooks';

let timer;

export function render(Component, target) {
  function workLoop() {
    if (current.shouldReRender) {
      current.shouldReRender = false;
      target.replaceChildren(<Component />);
    }

    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(workLoop);
  }
  timer = requestAnimationFrame(workLoop);
  //updateFocusState();
}

export default render;
