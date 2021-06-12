import React from 'react';
import { openHomePage } from '../../data/mediaData';
import styles from './style.css';

export default function Logo({ media }) {
  return (
    <a href="/" onClick={event => openHomePage(media, event)}>
      <img src={require('../../../assets/logo.svg')} className={styles.logo} />
    </a>
  );
}
