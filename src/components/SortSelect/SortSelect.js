/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import { sortMedia } from '../../data/mediaData';
import render from '../../framework';
import styles from './style.css';
import SortOptions from './SortOptions';

export default function SortSelect({ data, sort, mediaTypes }) {
  return (
    <label>
      Sort by:
      <select
        name="mediaSort"
        id="mediaSort"
        onchange={e => {
          sortMedia(data, sort, e);
        }}
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
//render
