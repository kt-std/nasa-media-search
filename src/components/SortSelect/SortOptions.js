import React from 'react';
import styles from './style.css';
import { SORTING_OPTIONS_TEXT } from '../../data/dataSettings';
import { isOptionNeeded } from '../../data/mediaData';
import Option from './Option';

export default function SortOptions({ isSortingSet, sortingOption, mediaTypes }) {
  return Object.keys(SORTING_OPTIONS_TEXT).map(option => {
    if (isOptionNeeded(mediaTypes, option)) {
      return ['ascending', 'descending'].map((sortType, i) => (
        <Option
          key={i}
          option={option}
          sortType={sortType}
          isSortingSet={isSortingSet}
          sortingOption={sortingOption}
        />
      ));
    }
  });
}
