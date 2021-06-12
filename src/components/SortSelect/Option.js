import React from 'react';
import styles from './style.css';
import { SORTING_OPTIONS_TEXT } from '../../data/dataSettings';

export default function Option({ option, sortType }) {
  return (
    <option value={`${option}_${sortType}`} className={styles.option}>
      {SORTING_OPTIONS_TEXT[option]}
      {sortType === 'ascending' ? '↑' : '↓'}
    </option>
  );
}
