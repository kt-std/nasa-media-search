import React from 'react';
import styles from './style.css';
import NoResults from '../NoResults';
import SortSelect from '../SortSelect';
import MediaCards from '../MediaCards';
import SelectedFiltersLayout from '../SelectedFiltersLayout';

export default function ResponseContent({ media }) {
  const data = media.data;
  return !media.data.noResults ? (
    <div className={styles.cards__wrapper} id="cardsWrapper">
      <div className={styles.sort_hits_wrapper}>
        <h3 className={styles.total_hits}>
          Total hits {media.data.totalHits} for {media.searchParams.searchValue}
        </h3>
        <SortSelect
          data={media.data}
          sort={media.sort}
          filter={media.filter}
          mediaTypes={media.searchParams.mediaTypes}
        />
      </div>
      <SelectedFiltersLayout filter={media.filter} data={data} />
      <MediaCards data={media.data} />
    </div>
  ) : (
    <NoResults />
  );
}
