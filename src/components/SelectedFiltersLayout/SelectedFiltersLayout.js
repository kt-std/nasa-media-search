import React from 'react';
import styles from './style.css';
import FilterButton from './FilterButton';
import SelectedFilters from './SelectedFilters';

export default function SelectedFiltersLayout({ filter, data }) {
  return (
    <div className={styles.selected__filters}>
      {filter.filtersSelected ? <SelectedFilters filter={filter} data={data} /> : null}
      {filter.selectedFiltersList.length ? <FilterButton data={data} filter={filter} /> : null}
    </div>
  );
}
