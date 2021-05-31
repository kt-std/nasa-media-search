import styles from './style.css';

export default function SearchButton() {
  return `<button class="${styles.search__button}" ${
    !window.data.mediaTypes.length || !window.data.searchValue ? `disabled="disabled"` : ''
  }>search</button>`;
}
