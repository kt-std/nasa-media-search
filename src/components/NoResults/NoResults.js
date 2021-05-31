import styles from './style.css';

export default function NoResults() {
  return `
  <div class="${styles.wrap}">
    <h2 class="${styles.no_results}"">No results found :(</h2>
  </div>`;
}
