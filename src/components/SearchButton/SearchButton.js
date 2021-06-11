import React from 'react';
import styles from './style.css';

export default function SearchButton({ selectedMediaTypes }) {
  return (
    <button className={styles.search__button} disabled={!selectedMediaTypes.length}>
      search
    </button>
  );
}
