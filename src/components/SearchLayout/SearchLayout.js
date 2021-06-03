/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework/element';
import styles from './style.css';
import MediaTypeSwitcher from '../MediaTypeSwitcher';
import SearchInput from '../SearchInput';
import SearchButton from '../SearchButton';
import Logo from '../Logo';

export default function SearchLayout({ searchPosition }) {
  const searchPositionClass = searchPosition === 'top' ? styles.form_top : styles.form_middle,
    searchClasses = [styles.form__wrapper, searchPositionClass].join(' ');
  return (
    <>
      <div class={searchClasses}>
        {searchPosition === 'top' ? <Logo /> : ``}
        <form
          onsubmit={event => window.searchByTerm(window.data, event)}
          id="searchForm"
          class={styles.form}
        >
          <div class={styles.search__box}>
            <MediaTypeSwitcher storage={window.data} />
            <SearchInput storage={window.data} />
          </div>
          <SearchButton />
        </form>
      </div>
    </>
  );
}
