/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';
import Filters from './Filters';

export default function FiltersByCategories({ data, filter }) {
  return !data.noResults ? (
    <form id="filters" class={styles.filters__wrapper}>
      <Filters data={data} filter={filter} />
    </form>
  ) : (
    ''
  );
}
