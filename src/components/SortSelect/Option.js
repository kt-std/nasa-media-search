/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';
import { SORTING_OPTIONS_TEXT } from '../../data/dataSettings';

export default function Option({ isSortingSet, sortingOption, option, sortType }) {
  const selected = isSortingSet && sortingOption === `${option}_${sortType}` ? true : false;
  return (
    <option value={`${option}_${sortType}`} class={styles.option} selected={selected}>
      {SORTING_OPTIONS_TEXT[option]}
      {sortType === 'ascending' ? '↑' : '↓'}
    </option>
  );
}
