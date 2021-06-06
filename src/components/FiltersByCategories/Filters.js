/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';
import { hasFilteringParameters } from '../../utils.js';
import FilterBlock from './FilterBlock';

export default function Filters({ filtersContent }) {
  return Object.keys(filtersContent).map(filterName => {
    if (hasFilteringParameters(filtersContent[filterName])) {
      return <FilterBlock filtersContent={filtersContent} filterName={filterName} />;
    }
    return <></>;
  });
}
