import styles from './style.css';
import SortOptions from './SortOptions';

export default function SortSelect() {
  return `
  <label>Sort by:
    <select name="mediaSort"  
      id="mediaSort" 
      onchange="window.sortMedia(window.data, event); window.renderApp()">
      ${SortOptions(window.data)}
    </select>
  </label>`;
}
