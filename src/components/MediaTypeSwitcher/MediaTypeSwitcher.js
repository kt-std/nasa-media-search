import React, { useState } from 'react';
import { updateMediaTypes, needToBeChecked, showMediaSwitch } from '../../data/mediaData';
import styles from './style.css';

export default function MediaTypeSwitcher({ selectedMediaTypes, setSelectedMediaTypes }) {
  const [showSwitcher, setShowSwitcher] = useState(false);
  return (
    <>
      <label className={styles.label}>
        {selectedMediaTypes.length ? selectedMediaTypes.join(', ') : 'Media type'}
        <input
          type="checkbox"
          className={styles.showMenu}
          checked={showSwitcher}
          onBlur={e => (e.relatedTarget === null ? setShowSwitcher(false) : null)}
          onChange={e => {
            const status = showSwitcher;
            setShowSwitcher(!status);
          }}
        />
      </label>

      <div className={showSwitcher ? [styles.wrapper, styles.visible].join(' ') : styles.wrapper}>
        {['image', 'audio', 'video'].map((mediaType, i) => (
          <div
            key={i}
            tabIndex="-1"
            id="inputWrapper"
            className={styles.inputWrapper}
            onBlur={e => showMediaSwitch(e, setShowSwitcher)}
          >
            <input
              type="checkbox"
              data-title={mediaType}
              className={styles.mediaType}
              name="mediaType"
              onChange={event =>
                updateMediaTypes(selectedMediaTypes, setSelectedMediaTypes, event.target)
              }
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
