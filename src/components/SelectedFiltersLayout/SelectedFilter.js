import styles from './style.css';

export default function SelectedFilter(filterSelected) {
  return `<div class="${styles.filter__selected_container}">
            <span class="${styles.filter__selected}">${filterSelected.categorie}: ${filterSelected.value}</span>
            <button class="${styles.remove__filter}" 
              onclick="window.removeFilter(window.data, this); renderApp();" 
              value="${filterSelected.value}" data-categorie="${filterSelected.categorie}">x</button>
          </div>`;
}
