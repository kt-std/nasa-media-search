/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';
import SelectedFilters from './SelectedFilters';
import FilterButton from './FilterButton';

export default function SelectedFiltersLayout({ filter, data }) {
  return (
    <div class={styles.selected__filters}>
      {filter.filtersSelected ? <SelectedFilters filter={filter} data={data} /> : ''}
      {filter.selectedFiltersList.length ? <FilterButton data={data} /> : ''}
    </div>
  );
}
