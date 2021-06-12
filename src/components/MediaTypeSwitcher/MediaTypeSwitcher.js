import React, { useState } from 'react';
import {
  updateMediaTypes,
  needToBeChecked,
  blurItemInContainer,
  hideSwitcher,
  checkSwitcher,
} from '../../data/mediaData';
import styles from './style.css';

export default function MediaTypeSwitcher({ selectedMediaTypes, setSelectedMediaTypes }) {
  const [focusOnSwitcher, setFocusOnSwitcher] = useState(false);
  const [focusInsideChild, setFocusInsideChild] = useState(false);
  return (
    <>
      <label className={styles.label}>
        <span className={styles.text}>
          {selectedMediaTypes.length ? selectedMediaTypes.join(', ') : 'Media type'}
        </span>
        <input
          id="showMenu"
          type="checkbox"
          className={styles.showMenu}
          checked={focusOnSwitcher}
          onBlur={e => hideSwitcher(e, 'showMenu', 'mediaType', 'wrapper', setFocusOnSwitcher)}
          onChange={e => checkSwitcher(e, setFocusOnSwitcher, setFocusInsideChild)}
        />
      </label>
      <div
        tabIndex="-1"
        id="wrapper"
        className={
          focusInsideChild || focusOnSwitcher
            ? [styles.wrapper, styles.visible].join(' ')
            : styles.wrapper
        }
      >
        {['image', 'audio', 'video'].map((mediaType, i) => (
          <div key={i} className={styles.inputWrapper} id="inputWrapper">
            <input
              type="checkbox"
              data-title={mediaType}
              className={styles.mediaType}
              name="mediaType"
              onBlur={e =>
                blurItemInContainer(
                  e,
                  'wrapper',
                  'mediaType',
                  setFocusInsideChild,
                  setFocusOnSwitcher,
                )
              }
              onChange={e => {
                updateMediaTypes(selectedMediaTypes, setSelectedMediaTypes, e.target);
              }}
              id={mediaType}
              defaultValue={mediaType}
              checked={needToBeChecked(selectedMediaTypes, mediaType)}
            />
            <label htmlFor={mediaType} className={styles.checkbox_label}>
              {mediaType}
            </label>
          </div>
        ))}
      </div>
    </>
  );
}
