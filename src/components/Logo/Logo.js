/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import { openHomePage } from '../../data/mediaData';
import styles from './style.css';

export default function Logo({ media }) {
  return (
    <a href="/" onclick={event => openHomePage(media, event)}>
      <img src={require('../../../assets/logo.svg')} class={styles.logo} />
    </a>
  );
}
