import styles from './style.css';
import MediaTypeSwitcher from '../MediaTypeSwitcher';
import SearchInput from '../SearchInput';
import SearchButton from '../SearchButton';
import Logo from '../Logo';

export default function SearchLayout(searchPosition) {
  return `
    <div class="${styles.form__wrapper} ${
    searchPosition === 'top' ? `${styles.form_top}` : `${styles.form_middle}`
  }">
    ${searchPosition === 'top' ? Logo() : ``}
    <form onsubmit="window.searchByTerm(window.data, event);" id="searchForm" class="${
      styles.form
    }">    
      <div class="${styles.search__box}">    
        ${MediaTypeSwitcher(window.data)}
        ${SearchInput(window.data)}
      </div>
        ${SearchButton()}
    </form>
    </div>`;
}
