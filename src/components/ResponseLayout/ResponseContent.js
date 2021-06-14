import React from 'react';
import styles from './style.css';
import ResultsNotFound from '../ResultsNotFound';
import SortSelect from '../SortSelect';
import MediaCards from '../MediaCards';
import SelectedFiltersLayout from '../SelectedFiltersLayout';

export default function ResponseContent({ media }) {
  const { data, searchParams } = media;
  return data.flattenedData.length ? (
    <div className={styles.cards__wrapper} id="cardsWrapper">
      <div className={styles.sort_hits_wrapper}>
        <h3 className={styles.total_hits}>
          Total hits {data.totalHits} for {searchParams.searchValue}
        </h3>
        <SortSelect
          data={data}
          sort={media.sort}
          filter={media.filter}
          mediaTypes={searchParams.mediaTypes}
        />
      </div>
      <SelectedFiltersLayout filter={media.filter} data={data} />
      <MediaCards data={data} />
    </div>
  ) : (
    <ResultsNotFound />
  );
}
