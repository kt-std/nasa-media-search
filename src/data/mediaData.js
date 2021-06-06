import {
  MEDIA_TYPE_SORTING_OPTIONS,
  MEDATADA_KEYS_BY_MEDIA_TYPE,
  SORTING_OPTIONS_TEXT,
  FILTERS_TEXT,
  FILTERS_BY_MEDIA_TYPE,
  RESPONSE_DATA_FILES,
} from './dataSettings';
import {
  hasFilteringParameters,
  getNumberFromString,
  getSeconds,
  getParametersValueFromNodeList,
  removeClass,
  addClass,
  removeSpacesFromLink,
  isElementInArray,
  keywordIsASingleWord,
} from '../utils';
import { requestMedia } from './imagesAPI';
import styles from '/style.css';
import renderApp from '../framework/renderer';

export function searchByTerm(error, searchParams, data, mediaRequest, filter, sort, e) {
  e.preventDefault();
  resetState(data, mediaRequest, sort, filter);
  mediaRequest.setIsDataLoading(true);
  /* requestMedia(searchParams, data, mediaRequest, error, filter);
  console.log(data);*/
}

export function openHomePage(storage, e) {
  e.preventDefault();
  storage.requestMade = false;
  storage.searchValue = null;
  storage.mediaTypes = [];
  resetState(storage);
  removeClass(`${styles.no_image__background}`, document.body);
  renderApp();
}

export function updateMediaTypes(mediaTypesValue, setMediaTypesCB, input) {
  const inputIndex = mediaTypesValue.indexOf(input.value);
  if (inputIndex === -1) {
    mediaTypesValue.push(input.value);
  } else {
    mediaTypesValue.splice(inputIndex, 1);
  }
  setMediaTypesCB(mediaTypesValue);
}

export function sortMedia(storage, e) {
  const data = storage.filtersSelected ? storage.filteredData : storage.flattenedData,
    [option, direction] = e.target.value.split('_');
  storage.sortingOption = e.target.value;
  storage.sortingSet = true;
  sortByDirection[direction](data, option);
}

export function filterItems(storage) {
  storage.performFiltering = true;
  storage.filteredData = [];
  storage.selectedFiltersList.forEach(filter => {
    const categorie = filter.categorie;
    storage.flattenedData.forEach(dataItem => {
      if (storage.filteredData.indexOf(dataItem) === -1 && dataItem[categorie]) {
        if (Array.isArray(dataItem[categorie])) {
          if (isElementInArray(dataItem[categorie], filter.value)) {
            storage.filteredData.push(dataItem);
          }
        } else {
          if (dataItem[categorie].toUpperCase() === filter.value) {
            storage.filteredData.push(dataItem);
          }
        }
      }
    });
  });
  storage.focusOnFilter = null;
  storage.totalHits = storage.filteredData.length;
}

export function selectFilter(storage, filter) {
  const { value } = filter,
    categorie = filter.getAttribute('data-categorie');
  storage.filtersSelected = true;
  if (!isFilterSelected(storage.selectedFiltersList, value, categorie)) {
    storage.selectedFiltersList.push({ value, categorie });
    storage.focusOnFilter = filter.name;
  } else {
    removeFilter(storage, filter);
    storage.focusOnFilter = null;
  }
  renderApp();
}

export function removeFilter(defaultStateParams, filter) {
  const { value: filterName } = filter,
    {} = defaultStateParams,
    categorie = filter.getAttribute('data-categorie'),
    deleteIndex = storage.selectedFiltersList.findIndex(
      element => element.value === filterName && categorie === element.categorie,
    );
  storage.focusOnFilter = null;
  storage.selectedFiltersList.splice(deleteIndex, 1);
  if (!storage.selectedFiltersList.length) {
    storage.performFiltering = false;
    storage.filtersSelected = false;
    storage.totalHits = storage.flattenedData.length;
  }
}

export function resetState(data, mediaRequest, sort, filter) {
  data.setTotalHits(null);
  data.setNoResults(false);
  mediaRequest.setAllRequestsMade(false);
  mediaRequest.setRequestMade(false);
  sort.setIsSortingSet(false);
  filter.setSelectedFiltersList([]);
  filter.setPerformFiltering(false);
  filter.setFiltersSelected(false);
  filter.setFilters({});

  // const resetStateParams = {
  //   totalHits: null,
  //   //sortingSet: false,
  //   requestMade: false,
  //   //focusOnFilter: null,
  //   selectedFiltersList: [],
  //   performFiltering: false,
  //   filtersSelected: false,
  //   filters: {},
  //   noResults: false,
  //   allRequestsMade: false,
  // };
  //setDefaultStateCB({ ...defaultStateParams, ...resetStateParams });
}

export function setError(errMessage, mediaRequest, error) {
  mediaRequest.setIsDataLoading(false);
  mediaRequest.setAllRequestsMade(true);
  error.setIsError(true);
  error.setErrorMessage(`Ooops!..${errMessage}.<br/>Try to reload the page`);
}

export function changeBackground() {
  //requestMadeCB(true);
  addClass(`${styles.no_image__background}`, document.body);
}

export function updateFocusState(focusOnFilter) {
  if (focusOnFilter !== null) document.querySelector(`[name="${focusOnFilter}"]`).focus();
}

export function isFilterSelected(filtersSelected, filterName, categorie) {
  return filtersSelected.some(
    filter => filter.categorie === categorie && filter.value === filterName,
  );
}

export function isOptionNeeded(mediaTypes, option) {
  return mediaTypes.some(mediaType => {
    return MEDIA_TYPE_SORTING_OPTIONS[mediaType].indexOf(option) !== -1;
  });
}

export const sortByDirection = {
  ascending: function (data, option) {
    data.sort((current, next) => (current[option] ? current[option] - next[option] : true));
  },
  descending: function (data, option) {
    data.sort((current, next) => (current[option] ? next[option] - current[option] : true));
  },
};

export function getResponseData(responseData) {
  return getConciseContentFromRespond(responseData);
}

function getConciseContentFromRespond(items) {
  return items.map(item => {
    const { data, href, links: [{ href: previewImage }] = [{ href: null }] } = item;
    const {
      keywords,
      date_created,
      center,
      media_type,
      title,
      secondary_creator = null,
      nasa_id,
    } = data[0];
    return {
      keywords: getOnlySingleWordKeyword(keywords),
      date: getSeconds(date_created),
      id: nasa_id,
      title,
      center,
      previewImage: removeSpacesFromLink(previewImage),
      href,
      mediaType: media_type,
      creator: getCreatorsList(secondary_creator),
    };
  });
}
//remove async
export function getFiltersAndUpdate(flattenedData, metadata) {
  getFiltersFromMetadata(metadata, flattenedData);
  //mediaRequest.setIsDataLoading(false);
  const { filters } = getFiltersFromLists(flattenedData),
    totalHits = flattenedData.length;
  return { filters, totalHits };
}

function getFiltersFromMetadata(metadata, flattenedData) {
  metadata.forEach((mediaMetadata, i) => {
    getFiltersDataFromMetadata(mediaMetadata, flattenedData[i]);
  });
}

function getFiltersDataFromMetadata(mediaMetadata, dataItem) {
  const mediaKeysNeeded = MEDATADA_KEYS_BY_MEDIA_TYPE[dataItem.mediaType];
  Object.keys(mediaKeysNeeded).forEach(key => {
    transformKeyValueToNumber(key, dataItem, mediaMetadata[mediaKeysNeeded[key]]);
  });
}

function getFiltersFromLists(flattenedData) {
  const filtersContainer = {};
  flattenedData.forEach(dataItem => {
    // mediaTypes.forEach(mediaType => {
    FILTERS_BY_MEDIA_TYPE[dataItem.mediaType].forEach(key => {
      if (!filtersContainer[key]) {
        filtersContainer[key] = {};
      }
      if (dataItem[key]) {
        if (Array.isArray(dataItem[key])) {
          dataItem[key].forEach(keyword => {
            //if (mediaType === dataItem.mediaType) {
            updateFilterValue(filtersContainer[key], keyword);
            //}
          });
        } else {
          updateFilterValue(filtersContainer[key], dataItem[key]);
        }
      }
    });
    //});
  });
  return { filters: filtersContainer };
}

function updateFilterValue(filtersContainer, keyword) {
  if (keyword !== undefined) {
    if (!filtersContainer[keyword.toUpperCase()]) {
      filtersContainer[keyword.toUpperCase()] = 1;
    } else {
      filtersContainer[keyword.toUpperCase()]++;
    }
  }
}

export function getMediaTypes() {
  const mediaTypes = document.querySelectorAll('input[name="mediaType"]:checked');
  return getParametersValueFromNodeList('value', mediaTypes);
}

export function setSelectedMediaTypes(mediaTypes) {
  return mediaTypes.length ? mediaTypes : null;
}

function getOnlySingleWordKeyword(keywords) {
  return keywords ? keywords.filter(keyword => keywordIsASingleWord(keyword)) : 'unknown';
}

function transformKeyValueToNumber(key, dataItem, metadataValue) {
  if (metadataValue) {
    switch (key) {
      case 'album':
        dataItem[key] = getImageAlbum(metadataValue);
        break;
      case 'duration':
        dataItem[key] = getDurationValueFromString(metadataValue);
        break;
      case 'size':
        dataItem[key] = getSizeInKBFromString(metadataValue);
        dataItem[`${key}Value`] = dataItem[key].value;
        break;
      case 'bitrate':
        dataItem[`${key}Value`] = getNumberFromString(metadataValue);
        dataItem[key] = metadataValue;
        break;
      case 'resolution':
        dataItem[key] = getResolutionFromString(metadataValue);
        dataItem[`${key}Origin`] = metadataValue;
        dataItem[`${key}Value`] = dataItem[key].height * dataItem[key].width;
        break;
      default:
        dataItem[key] = metadataValue;
    }
  } else {
    dataItem[key] = metadataValue;
  }
}

function getCreatorsList(creator) {
  return creator !== null ? splitStringWithDifferentSeparator(creator) : ['unknown'];
}

function getDurationValueFromString(duration) {
  if (duration && duration !== null) {
    const time = duration.match(/\d{1,}:\d{2}:\d{2}/g);
    return time !== null ? getSecondsFromDurationValue(time[0]) : undefined;
  }
  return undefined;
}

function getSecondsFromDurationValue(time) {
  const separatedTimeValues = parseDuration(time),
    [hours, minutes, seconds] = separatedTimeValues;
  return hours * 3600 + minutes * 60 + seconds;
}

function parseDuration(time) {
  return time.split(':').map(item => parseInt(item));
}

function getImageAlbum(value) {
  return !value ? 'unknown' : value;
}

function getSizeInKBFromString(value) {
  const [number, unit] = value.split(' ');
  switch (unit.toUpperCase()) {
    case 'KB':
      return { number, unit, value: getNumberFromString(number) };
    case 'MB':
      return { number, unit, value: getNumberFromString(number) * 1024 };
    case 'GB':
      return { number, unit, value: getNumberFromString(number) * 1024 * 1024 };
  }
}

function getResolutionFromString(value) {
  const [height, width] = value.toLowerCase().split('x');
  return { height: getNumberFromString(height), width: getNumberFromString(width), value };
}

function splitStringWithDifferentSeparator(stringToSplit) {
  stringToSplit = stringToSplit.replace(/[<>]||(\/>)/gm, '');
  if (stringToSplit.indexOf('/') === -1) {
    return stringToSplit.split(', ');
  } else {
    return stringToSplit.split('/');
  }
}
