import styles from './style.css';

export default function SearchInput(storage) {
  return `<input type="text" 
                 id="searchInput" 
                 placeholder='Search for ... (e.g. "Sun")'
                 class="${styles.search__input}"
                 onchange="window.data.searchValue = this.value;window.renderApp()"
                 value="${storage.searchValue !== null ? storage.searchValue : ``}">`;
}
