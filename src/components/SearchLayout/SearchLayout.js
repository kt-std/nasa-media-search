/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import { searchByTerm } from '../../data/mediaData';
import styles from './style.css';
import MediaTypeSwitcher from '../MediaTypeSwitcher';
import SearchInput from '../SearchInput';
import SearchButton from '../SearchButton';
import Logo from '../Logo';

export default function SearchLayout({
  searchPosition,
  mediaTypes,
  setMediaTypes,
  searchValue,
  setSearchValue,
}) {
  const searchPositionClass = searchPosition === 'top' ? styles.form_top : styles.form_middle,
    searchClasses = [styles.form__wrapper, searchPositionClass].join(' ');
  return (
    <>
      <div class={searchClasses}>
        {searchPosition === 'top' ? <Logo /> : ``}
        <form onsubmit={event} id="searchForm" class={styles.form}>
          <div class={styles.search__box}>
            <MediaTypeSwitcher mediaTypes={mediaTypes} setMediaTypes={setMediaTypes} />
            <SearchInput searchValue={searchValue} setSearchValue={setSearchValue} />
          </div>
          <SearchButton mediaTypes={mediaTypes} searchValue={searchValue} />
        </form>
      </div>
    </>
  );
}

//  searchByTerm(window.data, event)
