/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';
import SearchLayout from '../SearchLayout';
import FiltersByCategories from '../FiltersByCategories';
import ResponseContent from './ResponseContent';

export default function ResponseLayout({ searchPosition, media }) {
  return (
    <>
      <SearchLayout searchPosition={searchPosition} {...media} media={media} />
      <div class={styles.response__layout}>
        <br />
        <FiltersByCategories noResults={noResults} />
        <br />
      </div>
    </>
  );
}
/*

        <ResponseContent />

*/
