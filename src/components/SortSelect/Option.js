/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';
import { SORTING_OPTIONS_TEXT } from '../../data/dataSettings';

export default function Option({ storage, option, sortType }) {
  return (
    <option
      value={`${option}_${sortType}`}
      class={styles.option}
      selected={storage.sortingSet && storage.sortingOption === `${option}_${sortType}`}
    >
      {SORTING_OPTIONS_TEXT[option]}
      {sortType === 'ascending' ? '↑' : '↓'}
    </option>
  );
}
