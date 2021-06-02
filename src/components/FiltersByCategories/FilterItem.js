import styles from './style.css';
import { isFilterSelected } from '../../data/mediaData.js';

export default function FilterItem(filterName, filterCounter, categorie) {
  return `
    <label class="${styles.filter__label}"> 
      <input value="${filterName}" 
        name="${filterName}"
        data-categorie="${categorie}" 
        type="checkbox"
        ${
          isFilterSelected(window.data.selectedFiltersList, filterName, categorie)
            ? `checked="checked"`
            : ``
        }
        onchange="window.selectFilter(window.data, this); renderApp();">
      <span class="${styles.text}">${filterName} </span>
      <span class="${styles.filter__counter}">(${filterCounter})</span>      
    </label>
  `;
}
