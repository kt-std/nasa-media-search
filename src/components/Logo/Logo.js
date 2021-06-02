import styles from './style.css';

export default function Logo() {
  return `
    <a href="/" onclick="window.openHomePage(window.data, event); window.renderApp()">
      <img src="${require('../../../assets/logo.svg')}"  class="${styles.logo}">
    </a>`;
}
