/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';
import SelectedFilters from './SelectedFilters';
import FilterButton from './FilterButton';

export default function SelectedFiltersLayout({ storage }) {
  return (
    <div class={styles.selected__filters}>
      {storage.filtersSelected ? <SelectedFilters storage={storage} /> : ''}
      {storage.selectedFiltersList.length ? <FilterButton /> : ''}
    </div>
  );
}
