/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import ResponseLayout from '../ResponseLayout';
import Loader from '../Loader';
import SearchLayout from '../SearchLayout';
import { useSearchParams, useData, useError, useMediaRequest } from '../../framework/customHooks';

export default function App() {
  const searchParams = useSearchParams();
  const {
    responseData,
    setResponseData,
    flattenedData,
    setFlattenedData,
    filteredData,
    setFilteredData,
  } = useData();
  const { isError, setIsError, errorMessage, setErrorMessage } = useError();
  const {
    requestMade,
    setRequestMade,
    allRequestsMade,
    setAllRequestsMade,
    isDataLoading,
    setIsDataLoading,
  } = useMediaRequest();

  return (
    <>
      {requestMade ? (
        <ResponseLayout searchPosition={'top'} />
      ) : isDataLoading ? (
        <Loader text={''} />
      ) : isError ? (
        <Loader text={errorMessage} />
      ) : (
        <SearchLayout searchPosition={'middle'} {...searchParams} />
      )}
    </>
  );
}
