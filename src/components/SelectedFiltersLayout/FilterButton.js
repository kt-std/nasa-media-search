import styles from './style.css';

export default function FilterButton() {
  return `<button onclick='window.filterItems(window.data);renderApp()' 
            class="${styles.filter__button}">Apply filters</button>`;
}
