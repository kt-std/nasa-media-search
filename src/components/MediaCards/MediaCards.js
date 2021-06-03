/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework/element';
import styles from './style.css';
import Card from './Card';

export default function MediaCards({ storage }) {
  const data = !storage.performFiltering ? storage.flattenedData : storage.filteredData;
  return (
    <>
      {data.map(dataItem => (
        <Card dataItem={dataItem} />
      ))}
    </>
  );
}
