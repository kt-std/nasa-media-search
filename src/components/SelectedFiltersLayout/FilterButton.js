import React from 'react';
import { filterItems } from '../../data/mediaData';

import styles from './style.css';

export default function FilterButton({ data, filter }) {
  return (
    <button onClick={() => filterItems(data, filter)} className={styles.filter__button}>
      Apply filters
    </button>
  );
}
