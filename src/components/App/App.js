import React, { useState, useEffect } from 'react';
import ResponseLayout from '../ResponseLayout';
import Loader from '../Loader';
import SearchLayout from '../SearchLayout';
import { requestMedia } from '../../data/imagesAPI';
import { useMedia } from '../../customHooks';

import { SearchValueContext } from '../../context';

export default function App() {
  const media = useMedia();
  const [searchInputValue, setSearchInputValue] = useState('');
  return (
    <>
      <SearchValueContext.Provider value={{ searchInputValue, setSearchInputValue }}>
        {media.mediaRequest.requestMade ? (
          <ResponseLayout searchPosition={'top'} media={media} />
        ) : media.mediaRequest.isDataLoading ? (
          <Loader text={''} />
        ) : media.error.isError ? (
          <Loader text={media.error.errorMessage} />
        ) : (
          <SearchLayout searchPosition={'middle'} media={media} />
        )}
      </SearchValueContext.Provider>
    </>
  );
}
