/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework/element';
import styles from './style.css';

export default function Logo() {
  return (
    <a href="/" onclick={event => window.openHomePage(window.data, event)}>
      <img src={require('../../../assets/logo.svg')} class={styles.logo} />
    </a>
  );
}
