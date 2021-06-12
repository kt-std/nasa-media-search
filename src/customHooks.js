import { useState, useEffect } from 'react';
import {
  updateData,
  sortMedia,
  filterItems,
  changeBackground,
  isDataCached,
  updateCache,
} from './data/mediaData';
import { requestMedia } from './data/imagesAPI';
import { getPictureOfTheDay } from './data/apodAPI';

export const useMedia = () => {
  const searchParams = useSearchParams(),
    data = useData(),
    error = useError(),
    sort = useSort(),
    filter = useFilter(),
    mediaRequest = useMediaRequest(),
    [apod, setApod] = useState({}),
    [cache, setCache] = useState({});

  useEffect(() => {
    async function performRequest() {
      if (mediaRequest.isDataLoading) {
        const dataReceived = isDataCached(searchParams.mediaTypes, searchParams.searchValue, cache)
          ? cache[searchParams.searchValue].data
          : await requestMedia(searchParams.mediaTypes, searchParams.searchValue);
        if (!dataReceived.isError) {
          updateCache(cache, setCache, searchParams, dataReceived);
          updateData(dataReceived, data, filter, searchParams);
          mediaRequest.setRequestMade(true);
        } else {
          error.setIsError(true);
          error.setErrorMessage(dataReceived.errorText);
        }
        mediaRequest.setIsDataLoading(false);
        changeBackground();
      }
    }
    performRequest();
  }, [mediaRequest.isDataLoading]);

  useEffect(async () => {
    const apodData = await getPictureOfTheDay();
    setApod(apodData);
  }, []);

  return { searchParams, data, error, sort, filter, mediaRequest, apod };
};

export const useMediaRequest = () => {
  const [requestMade, setRequestMade] = useState(false);
  const [allRequestsMade, setAllRequestsMade] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  return {
    requestMade,
    setRequestMade,
    allRequestsMade,
    setAllRequestsMade,
    isDataLoading,
    setIsDataLoading,
  };
};

export const useSearchParams = () => {
  const [searchValue, setSearchValue] = useState('');
  const [mediaTypes, setMediaTypes] = useState([]);
  const [selectedMediaTypes, setSelectedMediaTypes] = useState([]);

  return {
    searchValue,
    setSearchValue,
    mediaTypes,
    setMediaTypes,
    selectedMediaTypes,
    setSelectedMediaTypes,
  };
};

export const useData = requestMade => {
  const [responseData, setResponseData] = useState([]);
  const [flattenedData, setFlattenedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [totalHits, setTotalHits] = useState(null);

  return {
    responseData,
    setResponseData,
    flattenedData,
    setFlattenedData,
    filteredData,
    setFilteredData,
    noResults,
    setNoResults,
    totalHits,
    setTotalHits,
  };
};

export const useSort = () => {
  const [isSortingSet, setIsSortingSet] = useState(false);
  const [sortingOption, setSortingOption] = useState(null);
  return { isSortingSet, setIsSortingSet, sortingOption, setSortingOption };
};

export const useFilter = () => {
  const [filters, setFilters] = useState({});
  const [selectedFiltersList, setSelectedFiltersList] = useState([]);
  const [filtersSelected, setFiltersSelected] = useState(false);
  return {
    filters,
    setFilters,
    selectedFiltersList,
    setSelectedFiltersList,
    filtersSelected,
    setFiltersSelected,
  };
};

export const useError = () => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  return { isError, setIsError, errorMessage, setErrorMessage };
};

export const useSearchInputValue = () => {
  const [searchInputValue, setSearchInputValue] = useState('');
  return { searchInputValue, setSearchInputValue };
};
