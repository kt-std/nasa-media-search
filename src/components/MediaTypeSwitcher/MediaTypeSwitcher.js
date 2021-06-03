/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework/element';
import styles from './style.css';

export default function MediaTypeSwitcher({ storage }) {
  return (
    <>
      <label for="mediaSwitcherButton" class={`${styles.label} ${styles.overflow}`}>
        {storage.mediaTypes.length ? storage.mediaTypes.join(', ') : 'Media type'}
      </label>
      <input type="checkbox" class={styles.button} id="mediaSwitcherButton" />
      <div class={styles.wrapper}>
        {['image', 'audio', 'video'].map(mediaType => (
          <div>
            <input
              type={'checkbox'}
              class={styles.mediaType}
              name="mediaType"
              onchange={event => updateMediaTypes(window.data, event.target)}
              id={mediaType}
              value={mediaType}
              checked={storage.mediaTypes.length && storage.mediaTypes.indexOf(mediaType) !== -1}
            />
            <label For={mediaType}>{mediaType}</label>
          </div>
        ))}
      </div>
    </>
  );
}
