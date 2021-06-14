import React from 'react';
import Loader from '../Loader';
import SearchLayout from '../SearchLayout';
import ResponseLayout from '../ResponseLayout';
import { requestMedia } from '../../data/imagesAPI';
import { SearchValueContext } from '../../context';
import { useMedia, useSearchInputValue } from '../../customHooks';

export default function App() {
  const media = useMedia();
  const searchInput = useSearchInputValue();
  return (
    <SearchValueContext.Provider
      value={{
        searchInputValue: searchInput.searchInputValue,
        setSearchInputValue: searchInput.setSearchInputValue,
      }}
    >
      {media.mediaRequest.requestMade ? (
        <ResponseLayout searchPosition={'top'} media={media} />
      ) : media.mediaRequest.isDataLoading ? (
        <Loader />
      ) : !media.error.responseOk ? (
        <Loader text={media.error.errorMessage} />
      ) : (
        <SearchLayout searchPosition={'middle'} media={media} />
      )}
    </SearchValueContext.Provider>
  );
}
