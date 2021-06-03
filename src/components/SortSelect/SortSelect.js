/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework/element';
import styles from './style.css';
import SortOptions from './SortOptions';

export default function SortSelect() {
  return (
    <label>
      Sort by:
      <select
        name="mediaSort"
        id="mediaSort"
        onchange={event => {
          window.sortMedia(window.data, event);
          window.renderApp();
        }}
      >
        <SortOptions storage={window.data} />
      </select>
    </label>
  );
}
//render
