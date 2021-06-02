import styles from './style.css';

export default function Loader(str) {
  return `<div class="${styles.loader}"data-text="${str}"></div>`;
}
