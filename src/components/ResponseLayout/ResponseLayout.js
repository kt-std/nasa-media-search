/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';
import SearchLayout from '../SearchLayout';
import FiltersByCategories from '../FiltersByCategories';
import ResponseContent from './ResponseContent';

export default function ResponseLayout({
  searchPosition,
  searchParams,
  data,
  sort,
  filter,
  mediaRequest,
  error,
}) {
  return (
    <>
      <SearchLayout
        searchPosition={searchPosition}
        searchParams={searchParams}
        data={data}
        sort={sort}
        filter={filter}
        mediaRequest={mediaRequest}
        error={error}
      />
      <div class={styles.response__layout}>
        <br />
      </div>
    </>
  );
}
/*
<FiltersByCategories noResults={noResults}/>
        <br />
        <ResponseContent />
*/
