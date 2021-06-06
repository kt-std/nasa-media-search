/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import ResponseLayout from '../ResponseLayout';
import Loader from '../Loader';
import SearchLayout from '../SearchLayout';
import { requestMedia } from '../../data/imagesAPI';
import { useEffect } from '../../framework';
import {
  useSearchParams,
  useData,
  useError,
  useMediaRequest,
  useSort,
  useFilter,
} from '../../framework/customHooks';

export default function App() {
  const searchParams = useSearchParams(),
    data = useData(),
    error = useError(),
    sort = useSort(),
    filter = useFilter(),
    mediaRequest = useMediaRequest();

  useEffect(() => {
    async function performRequest() {
      if (mediaRequest.isDataLoading) {
        const { filters, totalHits, flattenedData, mediaTypes } = await requestMedia();
        data.setTotalHits(totalHits);
        data.setFlattenedData(flattenedData);
        filter.setFilters(filters);
        searchParams.setMediaTypes(mediaTypes);
        mediaRequest.setIsDataLoading(false);
        mediaRequest.setRequestMade(true);
      }
    }
    performRequest();
  }, [mediaRequest.isDataLoading]);

  return (
    <>
      {mediaRequest.requestMade ? (
        <ResponseLayout
          searchPosition={'top'}
          searchParams={searchParams}
          data={data}
          sort={sort}
          filter={filter}
          mediaRequest={mediaRequest}
          error={error}
        />
      ) : mediaRequest.isDataLoading ? (
        <Loader text={''} />
      ) : error.isError ? (
        <Loader text={errorMessage} />
      ) : (
        <SearchLayout
          searchPosition={'middle'}
          searchParams={searchParams}
          data={data}
          sort={sort}
          filter={filter}
          mediaRequest={mediaRequest}
          error={error}
        />
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
