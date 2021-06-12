import React from 'react';
import styles from './style.css';
import { isFilterSelected, selectFilter } from '../../data/mediaData';

export default function FilterItem({ data, filter, filterName, filterCounter, categorie }) {
  return (
    <>
      <label className={styles.filter__label}>
        <input
          value={filterName}
          name={filterName}
          data-categorie={categorie}
          type="checkbox"
          defaultChecked={isFilterSelected(filter.selectedFiltersList, filterName, categorie)}
          onChange={e => selectFilter(data, filter, e)}
        />
        <span className={styles.text}>{filterName} </span>
        <span className={styles.filter__counter}>({filterCounter})</span>
      </label>
    </>
  );
}
