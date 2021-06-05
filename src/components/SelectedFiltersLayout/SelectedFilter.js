/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import render from '../../framework';
import { removeFilter } from '../../data/mediaData';
import styles from './style.css';

export default function SelectedFilter({ filterSelected }) {
  return (
    <div class={styles.filter__selected_container}>
      <span class={styles.filter__selected}>
        {filterSelected.categorie}: {filterSelected.value}
      </span>
      <button
        class={styles.remove__filter}
        onclick={event => {
          removeFilter(window.data, event.target);
          render();
        }}
        value={filterSelected.value}
        data-categorie={filterSelected.categorie}
      >
        x
      </button>
    </div>
  );
}
