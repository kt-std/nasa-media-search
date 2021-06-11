import React from 'react';
import styles from './style.css';

export default function NoResults() {
  return (
    <div className={styles.wrap}>
      <h2 className={styles.no_results}>No results found :(</h2>
    </div>
  );
}
