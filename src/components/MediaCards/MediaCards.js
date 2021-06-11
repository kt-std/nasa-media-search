import React, { useState } from 'react';
import styles from './style.css';
import Card from './Card';
import { useDataContext } from '../../context';

export default function MediaCards({ data }) {
  const mediaData = !data.filteredData.length ? data.flattenedData : data.filteredData;
  return (
    <div className={styles.cards_wrapper}>
      {mediaData.map((dataItem, i, arr) => (
        <Card dataItem={dataItem} index={i} key={i} />
      ))}
    </div>
  );
}
