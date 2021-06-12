import React from 'react';
import styles from './style.css';
import SelectedFilters from './SelectedFilters';
import FilterButton from './FilterButton';

export default function SelectedFiltersLayout({ filter, data }) {
  return (
    <div className={styles.selected__filters}>
      {filter.filtersSelected ? <SelectedFilters filter={filter} data={data} /> : ''}
      {filter.selectedFiltersList.length ? <FilterButton data={data} filter={filter} /> : ''}
    </div>
  );
}
