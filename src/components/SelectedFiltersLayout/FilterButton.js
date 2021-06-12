import React from 'react';
import styles from './style.css';
import { filterItems } from '../../data/mediaData';

export default function FilterButton({ data, filter }) {
  return (
    <button onClick={() => filterItems(data, filter)} className={styles.filter__button}>
      Apply filters
    </button>
  );
}
