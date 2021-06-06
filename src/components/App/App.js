/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import ResponseLayout from '../ResponseLayout';
import Loader from '../Loader';
import SearchLayout from '../SearchLayout';
import { requestMedia } from '../../data/imagesAPI';
import { useMedia } from '../../framework/customHooks';

export default function App() {
  const media = useMedia();

  return (
    <>
      {media.mediaRequest.requestMade ? (
        <ResponseLayout searchPosition={'top'} media={media} />
      ) : media.mediaRequest.isDataLoading ? (
        <Loader text={''} />
      ) : media.error.isError ? (
        <Loader text={errorMessage} />
      ) : (
        <SearchLayout searchPosition={'middle'} {...media} />
      )}
    </>
  );
}

/*
error: { isError, setIsError, errorMessage, setErrorMessage };
search: { searchValue, setSearchValue, mediaTypes, setMediaTypes };
data : {
    responseData,
    setResponseData,
    flattenedData,
    setFlattenedData,
    filteredData,
    setFilteredData,
+    noResults,
    setNoResults,
+    totalHits,
    setTotalHits,
  }
mediaRequest: {
+    requestMade,
    setRequestMade,
+    allRequestsMade,
    setAllRequestsMade,
    isDataLoading,
    setIsDataLoading,
  };
sort: { isSortingSet, setIsSortingSet, sortingOption, setSortingOption };
filter: {
    filters,
    setFilters,
    selectedFiltersList,
    setSelectedFiltersList,
    filtersSelected,
    setFiltersSelected,
    performFiltering,
    setPerformFiltering,
  };
*/
