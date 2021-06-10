/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';
import Card from './Card';
import { useDataContext } from '../../context';

export default function MediaCards({ data }) {
  const mediaData = !data.filteredData.length ? data.flattenedData : data.filteredData;
  return (
    <div class={styles.cards_wrapper}>
      {mediaData.map((dataItem, i) => (
        <Card dataItem={dataItem} index={i} />
      ))}
    </div>
  );
}
