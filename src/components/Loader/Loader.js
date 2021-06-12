import React from 'react';
import styles from './style.css';

export default function Loader({ text }) {
  return text ? (
    <div className={[styles.loader, styles.error].join(' ')} data-text="Houston, we have a problem">
      <p className={styles.error_text}>{text}</p>
    </div>
  ) : (
    <div className={[styles.loader, styles.text].join(' ')}>{text}</div>
  );
}
