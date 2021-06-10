/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';
import { useMediaTypesContext } from '../../context';

export default function SearchButton() {
  const mediaTypes = useMediaTypesContext();
  return (
    <button class={styles.search__button} disabled={!mediaTypes.length}>
      search
    </button>
  );
}
