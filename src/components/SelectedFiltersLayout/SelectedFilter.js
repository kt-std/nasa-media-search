/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import { removeFilter } from '../../data/mediaData';
import styles from './style.css';
import { AppContext } from '../../context';

export default function SelectedFilter({ data, filter, filterItem }) {
  return (
    <div class={styles.filter__selected_container}>
      <span class={styles.filter__selected}>
        {filterItem.categorie}: {filterItem.value}
      </span>
      <button
        class={styles.remove__filter}
        onclick={event => {
          removeFilter(data, filter, event);
        }}
        value={filterItem.value}
        data-categorie={filterItem.categorie}
      >
        x
      </button>
    </div>
  );
}
