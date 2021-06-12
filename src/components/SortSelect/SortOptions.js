import React from 'react';
import styles from './style.css';
import Option from './Option';
import { isOptionNeeded } from '../../data/mediaData';
import { SORTING_OPTIONS_TEXT } from '../../data/dataSettings';

export default function SortOptions({ mediaTypes }) {
  return Object.keys(SORTING_OPTIONS_TEXT).map(option => {
    if (isOptionNeeded(mediaTypes, option)) {
      return ['ascending', 'descending'].map((sortType, i) => (
        <Option key={i} option={option} sortType={sortType} />
      ));
    }
  });
}
