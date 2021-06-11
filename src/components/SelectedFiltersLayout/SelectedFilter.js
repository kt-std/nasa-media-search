import React from 'react';
import { removeFilter } from '../../data/mediaData';
import styles from './style.css';
import { AppContext } from '../../context';

export default function SelectedFilter({ data, filter, filterItem }) {
  return (
    <div className={styles.filter__selected_container}>
      <span className={styles.filter__selected}>
        {filterItem.categorie}: {filterItem.value}
      </span>
      <button
        className={styles.remove__filter}
        onClick={event => {
          removeFilter(data, filter.selectedFiltersList, filter, event);
        }}
        value={filterItem.value}
        data-categorie={filterItem.categorie}
      >
        x
      </button>
    </div>
  );
}
