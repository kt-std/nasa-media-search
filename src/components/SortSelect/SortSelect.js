import React from 'react';
import styles from './style.css';
import SortOptions from './SortOptions';
import { sortMedia } from '../../data/mediaData';

export default function SortSelect({ data, sort, filter, mediaTypes }) {
  return (
    <label>
      Sort by:
      <select
        name="mediaSort"
        id="mediaSort"
        onChange={e => sortMedia(data, sort, filter, e)}
        value={sort.sortingOption || ''}
      >
        <SortOptions mediaTypes={mediaTypes} />
      </select>
    </label>
  );
}
