/** @jsx createElement */
/*** @jsxFrag createFragment */

import { createElement } from './element';
import { updateFocusState } from '../data/mediaData';

let Component, Target;

export default function renderApp(componentFunction = null, target = null) {
  if (componentFunction) Component = componentFunction;
  if (target) Target = target;
  Target.innerHTML = '';
  Target.appendChild(<Component />);

  updateFocusState();
}
