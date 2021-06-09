/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import { isFilterSelected, selectFilter } from '../../data/mediaData.js';
import styles from './style.css';

export default function FilterItem({ data, filter, filterName, filterCounter, categorie }) {
  return (
    <>
      <label class={styles.filter__label}>
        <input
          value={filterName}
          name={filterName}
          data-categorie={categorie}
          type={'checkbox'}
          checked={isFilterSelected(filter.selectedFiltersList, filterName, categorie)}
          onchange={e => selectFilter(data, filter, e)}
        />
        <span class={styles.text}>{filterName} </span>
        <span class={styles.filter__counter}>({filterCounter})</span>
      </label>
    </>
  );
}
