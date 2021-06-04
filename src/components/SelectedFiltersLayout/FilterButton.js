/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework/element';
import renderApp from '../../framework/renderer';
import { filterItems } from '../../data/mediaData';

import styles from './style.css';

export default function FilterButton() {
  return (
    <button
      onclick={event => {
        filterItems(window.data);
        renderApp();
      }}
      class={styles.filter__button}
    >
      Apply filters
    </button>
  );
}
//render
