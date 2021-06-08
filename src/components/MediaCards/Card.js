/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';
import { darkenBackground, lightenBackground } from '../../data/mediaData';

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
      class={styles.item_container}
      onmouseover={e => darkenBackground()}
      onmouseout={e => lightenBackground()}
    >
      <div
        class={cardClass}
        id={dataItem.id}
        style={{ backgroundImage: `url(${backgroundURL})` }}
        data-background={dataItem.previewImage}
        data-title={dataItem.title}
      ></div>
      <div class={styles.description}>
        <h4 class={styles.heading}>{dataItem.title}</h4>
        <h5 class={styles.id}>{dataItem.id}</h5>
        <p class={styles.description_text}>{dataItem.description}</p>
      </div>
    </div>
  );
}
