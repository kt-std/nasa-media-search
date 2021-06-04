/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework/element';
import { sortMedia } from '../../data/mediaData';
import renderApp from '../../framework/renderer';
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
          sortMedia(window.data, event);
          renderApp();
        }}
      >
        <SortOptions storage={window.data} />
      </select>
    </label>
  );
}
//render
