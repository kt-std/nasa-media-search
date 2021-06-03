/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework/element';
import styles from './style.css';
import Filters from './Filters';

export default function FiltersByCategories() {
  return !window.data.noResults ? (
    <form id="filters" class={styles.filters__wrapper}>
      <Filters filtersContainer={window.data.filters} />
    </form>
  ) : (
    ''
  );
}
