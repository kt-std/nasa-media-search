/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';
import SelectedFilter from './SelectedFilter';

export default function SelectedFilters({ filter, data }) {
  return filter.selectedFiltersList.map(filterItem => (
    <SelectedFilter filter={filter} data={data} filterItem={filterItem} />
  ));
}
