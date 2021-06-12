import React from 'react';
import styles from './style.css';
import { blurFromItem } from '../../data/mediaData';

export default function CardDescription({ index, dataItem }) {
  return (
    <div
      tabIndex="1"
      onBlur={e => blurFromItem(e, styles.visible)}
      className={styles.description}
      id={`description_${index}`}
    >
      <h4 className={styles.heading}>{dataItem.title}</h4>
      <h5 className={styles.id}>
        {dataItem.id}
        {dataItem.sizeValue ? (
          <span className={styles.size}>
            ({dataItem.size.number} {dataItem.size.unit})
          </span>
        ) : null}
      </h5>
      <a href={dataItem.download} className={styles.download} target="_blank">
        Download ⇩
      </a>
      <p className={styles.description_text}>{dataItem.description}</p>
    </div>
  );
}
