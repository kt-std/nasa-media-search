import React, { useState } from 'react';
import styles from './style.css';
import { setBackground, setOpositeState } from '../../data/mediaData';

export default function PictureOfTheDay({ apod }) {
  const [showPicture, setShowPicture] = useState(false);
  return !apod.isError ? (
    <div className={styles.container}>
      <input
        id="check"
        type="checkbox"
        checked={showPicture}
        onChange={e => setOpositeState(showPicture, setShowPicture)}
        className={styles.showPicture}
      />
      <label htmlFor="check" className={styles.checkbox}>
        show pod
      </label>
      <span className={styles.pod}>i</span>
      <div className={styles.picture_container_background}>
        <div className={styles.picture_container}>
          <button
            className={styles.button}
            onClick={e => setOpositeState(showPicture, setShowPicture)}
          >
            x
          </button>
          <div style={setBackground(apod.imageURL)} className={styles.picture}></div>
          <h4 className={styles.title}>{apod.title}</h4>
          <time dateTime={apod.date} className={styles.date}>
            {apod.date}
          </time>
        </div>
      </div>
    </div>
  ) : null;
}
