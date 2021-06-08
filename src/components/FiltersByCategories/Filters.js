/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';
import { hasFilteringParameters } from '../../utils.js';
import { FILTERS_TEXT } from '../../data/dataSettings';
import FilterItem from './FilterItem';

export default function Filters({ filter, data }) {
  const { filters } = filter;
  return Object.keys(filters).map(filterName => {
    if (hasFilteringParameters(filters[filterName])) {
      return (
        <>
          <h3 class={styles.filter__heading}>{FILTERS_TEXT[filterName]}</h3>
          <div class={styles.filter__item_wrapper}>
            {Object.keys(filters[filterName]).map(filterContent => (
              <FilterItem
                filterName={filterContent}
                filterCounter={filters[filterName][filterContent]}
                categorie={filterName}
                filter={filter}
                data={data}
              />
            ))}
          </div>
        </>
      );
    }
    return <></>;
  });
}
// <FilterBlock filtersContent={filtersContent} filterName={filterName} />;
