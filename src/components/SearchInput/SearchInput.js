/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import render from '../../framework';
import styles from './style.css';

export default function SearchInput({ searchValue, setSearchValue }) {
  return (
    <input
      type="text"
      id="searchInput"
      required
      placeholder='Search for ... (e.g. "M101")'
      class={styles.search__input}
      onchange={event => {
        setSearchValue(event.target.value);
      }}
      value={searchValue !== null ? searchValue : ``}
    />
  );
}
