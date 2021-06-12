import React from 'react';
import styles from './style.css';
import SearchLayout from '../SearchLayout';
import ResponseContent from './ResponseContent';
import FiltersByCategories from '../FiltersByCategories';

export default function ResponseLayout({ searchPosition, media }) {
  return (
    <>
      <SearchLayout searchPosition={searchPosition} media={media} />
      <div className={styles.response__layout}>
        <br />
        <FiltersByCategories data={media.data} filter={media.filter} />
        <br />
        <ResponseContent media={media} />
      </div>
    </>
  );
}
