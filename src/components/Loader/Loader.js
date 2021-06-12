import React from 'react';
import styles from './style.css';

export default function Loader({ text }) {
  const loader_text = `${styles.loader} ${styles.text}`,
    error = `${styles.loader} ${styles.error}`;
  return text ? (
    <div className={error} data-text="Houston, we have a problem">
      <p className={styles.error_text}>{text}</p>
    </div>
  ) : (
    <div className={loader_text}>{text}</div>
  );
}
