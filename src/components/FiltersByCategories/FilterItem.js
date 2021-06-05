/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';
import { isFilterSelected, selectFilter } from '../../data/mediaData.js';

export default function FilterItem({ filterName, filterCounter, categorie }) {
  return (
    <>
      <label class={styles.filter__label}>
        <input
          value={filterName}
          name={filterName}
          data-categorie={categorie}
          type={'checkbox'}
          checked={isFilterSelected(window.data.selectedFiltersList, filterName, categorie)}
          onchange={event => selectFilter(window.data, event.target)}
        />
        <span class={styles.text}>{filterName} </span>
        <span class={styles.filter__counter}>({filterCounter})</span>
      </label>
    </>
  );
}
