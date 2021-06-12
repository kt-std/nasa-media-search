import React from 'react';
import styles from './style.css';
import SelectedFilter from './SelectedFilter';

export default function SelectedFilters({ filter, data }) {
  return filter.selectedFiltersList.map((filterItem, i) => (
    <SelectedFilter filter={filter} data={data} filterItem={filterItem} key={i} />
  ));
}
