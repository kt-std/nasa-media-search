/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';

export default function SearchButton({ mediaTypes }) {
  return (
    <button class={styles.search__button} disabled={!mediaTypes.length}>
      search
    </button>
  );
}
