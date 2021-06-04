/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework/element';
import styles from './style.css';

//TODO: fix styling problems style = [object Object]

export default function Card({ dataItem }) {
  const cardType =
      dataItem.mediaType === 'audio'
        ? styles.audio
        : dataItem.mediaType === 'video'
        ? styles.video
        : styles.image,
    cardClass = `${styles.card__item} ${cardType}`,
    backgroundURL =
      dataItem.previewImage !== null ? dataItem.previewImage : require('../../../assets/audio.svg');
  return (
    <div
      class={cardClass}
      id={dataItem.id}
      style={{ backgroundImage: `url(${backgroundURL})` }}
      data-background={dataItem.previewImage}
      data-title={dataItem.title}
    ></div>
  );
}
