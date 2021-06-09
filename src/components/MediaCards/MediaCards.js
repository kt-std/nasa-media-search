/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';
import Card from './Card';

export default function MediaCards({ filter, data }) {
  const mediaData = !data.filteredData.length ? data.flattenedData : data.filteredData;
  return (
    <div class={styles.cards_wrapper}>
      {mediaData.map((dataItem, i) => (
        <Card dataItem={dataItem} index={i} />
      ))}
    </div>
  );
}
