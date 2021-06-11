import React from 'react';
import { sortMedia } from '../../data/mediaData';
import styles from './style.css';
import SortOptions from './SortOptions';

export default function SortSelect({ data, sort, filter, mediaTypes }) {
  return (
    <label>
      Sort by:
      <select
        name="mediaSort"
        id="mediaSort"
        onChange={e => {
          sortMedia(data, sort, filter, e);
        }}
        value={sort.sortingOption || ''}
      >
        <SortOptions
          isSortingSet={sort.isSortingSet}
          sortingOption={sort.sortingOption}
          mediaTypes={mediaTypes}
        />
      </select>
    </label>
  );
}
