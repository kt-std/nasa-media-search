export const dataStore = {
  requestMade: false,
  allRequestsMade: false,
  isDataLoading: false,

  noResults: false,

  isError: false,
  errorMessage: '',

  filters: {},
  filtersSelected: false,
  selectedFiltersList: [],
  performFiltering: false,

  flattenedData: [],
  filteredData: [],
  responseData: [],

  mediaTypes: [],
  totalHits: null,
  searchValue: null,

  focusOnFilter: null,

  sortingSet: false,
  sortingOption: null,
};
