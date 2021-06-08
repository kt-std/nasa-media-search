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
  searchParams,
  data,
  mediaRequest,
  filter,
  sort,
  error,
  media,
}) {
  const searchPositionClass = searchPosition === 'top' ? styles.form_top : styles.form_middle,
    searchClasses = [styles.form__wrapper, searchPositionClass].join(' ');
  return (
    <>
      <div class={searchClasses}>
        {searchPosition === 'top' ? <Logo media={media} /> : ``}
        <form
          onsubmit={event => searchByTerm(error, data, mediaRequest, filter, sort, event)}
          id="searchForm"
          class={styles.form}
        >
          <div class={styles.search__box}>
            <MediaTypeSwitcher
              mediaTypes={searchParams.mediaTypes}
              setMediaTypes={searchParams.setMediaTypes}
            />
            <SearchInput
              searchValue={searchParams.searchValue}
              setSearchValue={searchParams.setSearchValue}
            />
          </div>
          <SearchButton mediaTypes={searchParams.mediaTypes} />
        </form>
      </div>
    </>
  );
}
