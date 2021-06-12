import React from 'react';
import styles from './style.css';

export default function SearchInput({ searchValue, setSearchValue }) {
  return (
    <input
      type="text"
      id="searchInput"
      required
      placeholder='Search for ... (e.g. "M101")'
      className={styles.search__input}
      onChange={event => {
        setSearchValue(event.target.value);
      }}
      value={searchValue !== null ? searchValue : ``}
    />
  );
}
