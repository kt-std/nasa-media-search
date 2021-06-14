import React from 'react';
import styles from './style.css';
import Filters from './Filters';

export default function FiltersByCategories({ data, filter }) {
  return data.flattenedData.length ? (
    <form id="filters" className={styles.filters__wrapper}>
      <Filters data={data} filter={filter} />
    </form>
  ) : null;
}
