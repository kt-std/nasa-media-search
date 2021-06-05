/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';
import { hasFilteringParameters } from '../../utils.js';
import FilterBlock from './FilterBlock';

export default function Filters({ filtersContainer }) {
  return Object.keys(filtersContainer).map(filterName => {
    if (hasFilteringParameters(filtersContainer[filterName])) {
      return <FilterBlock filtersContainer={filtersContainer} filterName={filterName} />;
    }
    return <></>;
  });
}
