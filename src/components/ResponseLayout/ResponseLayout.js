/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework/element';
import styles from './style.css';
import SearchLayout from '../SearchLayout';
import FiltersByCategories from '../FiltersByCategories';
import ResponseContent from './ResponseContent';

export default function ResponseLayout({ searchPosition }) {
  return (
    <>
      <SearchLayout searchPosition={searchPosition} />
      <div class={styles.response__layout}>
        <br />
        <FiltersByCategories />
        <br />
        <ResponseContent />
      </div>
    </>
  );
}
