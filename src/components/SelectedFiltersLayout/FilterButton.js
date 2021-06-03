/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework/element';
import styles from './style.css';

export default function FilterButton() {
  return (
    <button
      onclick={event => {
        window.filterItems(window.data);
        renderApp();
      }}
      class={styles.filter__button}
    >
      Apply filters
    </button>
  );
}
//render
