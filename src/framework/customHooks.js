import { useState, useEffect } from './hooks';

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
  const [searchValue, setSearchValue] = useState(null);
  const [mediaTypes, setMediaTypes] = useState([]);
  return { searchValue, setSearchValue, mediaTypes, setMediaTypes };
};

export const useData = () => {
  const [responseData, setResponseData] = useState([]);
  const [flattenedData, setFlattenedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [totalHits, setTotalHits] = useState(null);

  /*useEffect([requestMade])
  is request media Made => get searchValue and made request 
  if no data=> no results
  if data => totalHits
  */

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

  //useEffect([sortingOption]) when isSortingSet => sort media

  return { isSortingSet, setIsSortingSet, sortingOption, setSortingOption };
};

export const useFilter = () => {
  const [filters, setFilters] = useState({});
  const [selectedFiltersList, setSelectedFiltersList] = useState([]);
  const [filtersSelected, setFiltersSelected] = useState(false);
  const [performFiltering, setPerformFiltering] = useState(false);

  //useEffect([perfomFiltering]) when filtersSelected.length => filter media

  return {
    filters,
    setFilters,
    selectedFiltersList,
    setSelectedFiltersList,
    filtersSelected,
    setFiltersSelected,
    performFiltering,
    setPerformFiltering,
  };
};

export const useError = () => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  return { isError, setIsError, errorMessage, setErrorMessage };
};
