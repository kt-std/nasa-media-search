import React from 'react';
import styles from './style.css';
import { useSearchValueContext } from '../../context';

export default function SearchInput() {
  const { searchInputValue, setSearchInputValue } = useSearchValueContext();
  return (
    <input
      type="text"
      id="searchInput"
      required
      placeholder='Search for ... (e.g. "M101")'
      className={styles.search__input}
      onChange={event => {
        setSearchInputValue(event.target.value);
      }}
      value={searchInputValue !== null ? searchInputValue : ``}
    />
  );
}
