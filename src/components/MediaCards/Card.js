/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';
import { showDescription } from '../../data/mediaData';

//TODO: fix styling problems style = [object Object]

export default function Card({ dataItem, index }) {
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
    <div class={styles.item_container}>
      <div
        class={cardClass}
        id={dataItem.id}
        style={{ backgroundImage: `url(${backgroundURL})` }}
        data-background={dataItem.previewImage}
        data-title={dataItem.title}
        data-index={index}
        tabindex="0"
        onclick={e => showDescription(styles.visible, e)}
        onkeypress={e => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            showDescription(styles.visible, e);
          }
        }}
      ></div>
      <div class={styles.description} id={`description_${index}`}>
        <h4 class={styles.heading}>{dataItem.title}</h4>
        <h5 class={styles.id}>
          {dataItem.id}
          {dataItem.sizeValue ? (
            <span class={styles.size}>
              ({dataItem.size.number} {dataItem.size.unit})
            </span>
          ) : (
            ''
          )}
        </h5>
        <a href={dataItem.download} class={styles.download} target="_blank">
          Download ⇩
        </a>
        <p class={styles.description_text}>{dataItem.description}</p>
      </div>
    </div>
  );
}
