/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework/element';
import { openHomePage } from '../../data/mediaData';
import styles from './style.css';

export default function Logo() {
  return (
    <a href="/" onclick={event => openHomePage(window.data, event)}>
      <img src={require('../../../assets/logo.svg')} class={styles.logo} />
    </a>
  );
}
