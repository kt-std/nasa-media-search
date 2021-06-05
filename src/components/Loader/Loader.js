/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import styles from './style.css';

export default function Loader({ text }) {
  return <div class={styles.loader} data-text={text}></div>;
}
