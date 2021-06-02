import ResponseLayout from '../ResponseLayout';
import Loader from '../Loader';
import SearchLayout from '../SearchLayout';

export default function App() {
  return `${
    window.data.requestMade
      ? ResponseLayout('top')
      : window.data.isDataLoading
      ? Loader('')
      : window.data.isError
      ? Loader(window.data.errorMessage)
      : SearchLayout('middle')
  }`;
}
