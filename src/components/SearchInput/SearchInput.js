/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import render from '../../framework';
import styles from './style.css';

export default function SearchInput({ storage }) {
  return (
    <input
      type="text"
      id="searchInput"
      placeholder='Search for ... (e.g. "M101")'
      class={styles.search__input}
      onchange={event => {
        window.data.searchValue = event.target.value;
        render();
      }}
      value={storage.searchValue !== null ? storage.searchValue : ``}
    />
  );
}
