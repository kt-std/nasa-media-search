import styles from './style.css';
import SortSelect from '../SortSelect';
import SelectedFiltersLayout from '../SelectedFiltersLayout';
import MediaCards from '../MediaCards';
import NoResults from '../NoResults';
//TODO: fix searchValue update when input is changed
export default function ResponseContent() {
  return !window.data.noResults
    ? `
  <div class="${styles.cards__wrapper}" id="cardsWrapper">
    <div class="${styles.sort_hits_wrapper}">
      <h3 class="${styles.total_hits}">
        Total hits ${window.data.totalHits} for ${window.data.searchValue}
      </h3>  
      ${SortSelect()}
    </div>
    ${SelectedFiltersLayout(window.data)}
    ${MediaCards(window.data)}
  </div>
  `
    : NoResults();
}
