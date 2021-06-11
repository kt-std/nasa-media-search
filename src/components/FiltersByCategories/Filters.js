import React from 'react';
import styles from './style.css';
import { hasFilteringParameters } from '../../utils.js';
import { FILTERS_TEXT } from '../../data/dataSettings';
import FilterItem from './FilterItem';

export default function Filters({ filter, data }) {
  const { filters } = filter;
  return Object.keys(filters).map((filterName, blockId) => {
    if (hasFilteringParameters(filters[filterName])) {
      return (
        <React.Fragment key={blockId}>
          <h3 className={styles.filter__heading}>{FILTERS_TEXT[filterName]}</h3>
          <div className={styles.filter__item_wrapper}>
            {Object.keys(filters[filterName]).map((filterContent, i) => (
              <React.Fragment key={Math.random()}>
                <FilterItem
                  filterName={filterContent}
                  filterCounter={filters[filterName][filterContent]}
                  categorie={filterName}
                  filter={filter}
                  data={data}
                />
              </React.Fragment>
            ))}
          </div>
        </React.Fragment>
      );
    }
    return <></>;
  });
}
// <FilterBlock filtersContent={filtersContent} filterName={filterName} />;
