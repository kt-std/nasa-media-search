/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';

export default function Loader({ text }) {
  const loader_text = `${styles.loader} ${styles.text}`,
    error = `${styles.loader} ${styles.error}`;
  return text ? (
    <div class={error} data-text="Houston, we have a problem">
      <p class={styles.error_text}>{text}</p>
    </div>
  ) : (
    <div class={loader_text}></div>
  );
}
