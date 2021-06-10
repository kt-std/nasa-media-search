/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import { updateMediaTypes } from '../../data/mediaData';
import styles from './style.css';

import { useMediaTypesContext } from '../../context';

export default function MediaTypeSwitcher({ setMediaTypes }) {
  const mediaTypes = useMediaTypesContext();
  return (
    <>
      <label for="mediaSwitcherButton" class={`${styles.label} ${styles.overflow}`}>
        {mediaTypes.length ? mediaTypes.join(', ') : 'Media type'}
      </label>
      <input type="checkbox" class={styles.button} id="mediaSwitcherButton" />
      <div class={styles.wrapper}>
        {['image', 'audio', 'video'].map(mediaType => (
          <div>
            <input
              type="checkbox"
              class={styles.mediaType}
              name="mediaType"
              onchange={event => updateMediaTypes(mediaTypes, setMediaTypes, event.target)}
              id={mediaType}
              value={mediaType}
              checked={mediaTypes.length && mediaTypes.indexOf(mediaType) !== -1}
            />
            <label For={mediaType}>{mediaType}</label>
          </div>
        ))}
      </div>
    </>
  );
}
