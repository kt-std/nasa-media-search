/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework/element';
import styles from './style.css';

export default function SearchButton() {
  return (
    <button
      class={styles.search__button}
      disabled={!window.data.mediaTypes.length || !window.data.searchValue}
    >
      search
    </button>
  );
}
