/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import render from '../../framework';
import { filterItems } from '../../data/mediaData';

import styles from './style.css';

export default function FilterButton({ data }) {
  return (
    <button
      onclick={event => {
        filterItems(data);
      }}
      class={styles.filter__button}
    >
      Apply filters
    </button>
  );
}
//render
