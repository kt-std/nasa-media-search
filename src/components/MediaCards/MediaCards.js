/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';
import Card from './Card';

export default function MediaCards({ filter, data }) {
  const mediaData = !filter.performFiltering ? data.flattenedData : data.filteredData;
  return (
    <>
      {mediaData.map(dataItem => (
        <Card dataItem={dataItem} />
      ))}
    </>
  );
}
