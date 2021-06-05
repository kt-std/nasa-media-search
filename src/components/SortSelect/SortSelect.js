/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import { sortMedia } from '../../data/mediaData';
import render from '../../framework';
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
          render();
        }}
      >
        <SortOptions storage={window.data} />
      </select>
    </label>
  );
}
//render
