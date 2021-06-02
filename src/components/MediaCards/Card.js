import styles from './style.css';

export default function Card(dataItem) {
  return `
  <div class="${styles.card__item} 
    ${
      dataItem.mediaType === 'audio'
        ? `${styles.audio}`
        : dataItem.mediaType === 'video'
        ? `${styles.video}`
        : `${styles.image}`
    }" 
    id="${dataItem.id}"
    data-background="${dataItem.previewImage}"
    style="background-image: url(
    ${
      dataItem.previewImage !== null ? dataItem.previewImage : require('../../../assets/audio.svg')
    })" 
    data-title="${dataItem.title}">
  </div>`;
}
