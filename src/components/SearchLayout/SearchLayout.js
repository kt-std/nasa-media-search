import React from 'react';
import { searchByTerm } from '../../data/mediaData';
import styles from './style.css';
import MediaTypeSwitcher from '../MediaTypeSwitcher';
import SearchInput from '../SearchInput';
import SearchButton from '../SearchButton';
import Logo from '../Logo';

export default function SearchLayout({ searchPosition, media }) {
  const { searchParams, data, mediaRequest, filter, sort, error } = media;
  const searchPositionClass = searchPosition === 'top' ? styles.form_top : styles.form_middle,
    searchClasses = [styles.form__wrapper, searchPositionClass].join(' ');
  return (
    <>
      <div className={searchClasses}>
        {searchPosition === 'top' ? <Logo media={media} /> : ``}
        <form
          onSubmit={event =>
            searchByTerm(searchParams, error, data, mediaRequest, filter, sort, event)
          }
          id="searchForm"
          className={styles.form}
        >
          <div className={styles.search__box}>
            <MediaTypeSwitcher
              selectedMediaTypes={searchParams.selectedMediaTypes}
              setSelectedMediaTypes={searchParams.setSelectedMediaTypes}
            />
            <SearchInput
              searchValue={searchParams.searchValue}
              setSearchValue={searchParams.setSearchValue}
            />
          </div>
          <SearchButton selectedMediaTypes={searchParams.selectedMediaTypes} />
        </form>
      </div>
    </>
  );
}
