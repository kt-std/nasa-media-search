/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework';
import ResponseLayout from '../ResponseLayout';
import Loader from '../Loader';
import SearchLayout from '../SearchLayout';

export default function App() {
  return (
    <>
      {window.data.requestMade ? (
        <ResponseLayout searchPosition={'top'} />
      ) : window.data.isDataLoading ? (
        <Loader text={''} />
      ) : window.data.isError ? (
        <Loader text={window.data.errorMessage} />
      ) : (
        <SearchLayout searchPosition={'middle'} />
      )}
    </>
  );
}
