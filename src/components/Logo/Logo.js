import React from 'react';
import styles from './style.css';
import { openHomePage } from '../../data/mediaData';
import { useSearchValueContext } from '../../context';

export default function Logo({ media }) {
  const { setSearchInputValue } = useSearchValueContext();
  return (
    <a href="/" onClick={event => openHomePage(media, setSearchInputValue, event)}>
      <img src={require('../../../assets/logo.svg')} className={styles.logo} />
    </a>
  );
}
