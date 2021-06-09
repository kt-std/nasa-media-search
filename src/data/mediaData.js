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

export function searchByTerm(error, data, mediaRequest, filter, sort, e) {
  e.preventDefault();
  resetState(data, mediaRequest, sort, filter, error);
  mediaRequest.setIsDataLoading(true);
}

export function openHomePage(media, e) {
  const { data, mediaRequest, searchParams, sort, filter, error } = media;
  e.preventDefault();
  mediaRequest.setRequestMade(false);
  searchParams.setSearchValue(null);
  searchParams.setMediaTypes([]);
  resetState(data, mediaRequest, sort, filter, error);
  removeClass(`${styles.no_image__background}`, document.body);
}

export function updateData(dataParams, data, filter, searchParams) {
  const { filters, totalHits, flattenedData, mediaTypes, noResults } = dataParams;
  data.setTotalHits(totalHits);
  data.setNoResults(noResults);
  data.setFlattenedData(flattenedData);
  filter.setFilters(filters);
  searchParams.setMediaTypes(mediaTypes);
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

export function sortMedia(data, sort, e) {
  const { mediaData, setCB } = data.filtersSelected
      ? { mediaData: data.filteredData, setCB: data.setFilteredData }
      : { mediaData: data.flattenedData, setCB: data.setFlattenedData },
    [option, direction] = e.target.value.split('_');
  sort.setSortingOption(e.target.value);
  sort.setIsSortingSet(true);
  sortByDirection(mediaData, option, direction);
  setCB(mediaData);
}

export function filterItems(data, filterData) {
  const filteredData = [];
  filterData.selectedFiltersList.forEach(filter => {
    const { categorie } = filter;
    data.flattenedData.forEach(dataItem => {
      if (filteredData.indexOf(dataItem) === -1 && dataItem[categorie]) {
        if (Array.isArray(dataItem[categorie])) {
          if (isElementInArray(dataItem[categorie], filter.value)) {
            filteredData.push(dataItem);
          }
        } else {
          if (dataItem[categorie].toUpperCase() === filter.value) {
            filteredData.push(dataItem);
          }
        }
      }
    });
  });
  data.setFilteredData(filteredData);
  data.setTotalHits(filteredData.length);
}

export function selectFilter(data, filterData, e) {
  const filterValue = e.target.value,
    categorie = e.target.getAttribute('data-categorie');
  filterData.setFiltersSelected(true);
  if (!isFilterSelected(filterData.selectedFiltersList, filterValue, categorie)) {
    filterData.selectedFiltersList.push({ value: filterValue, categorie });
  } else {
    removeFilter(data, filterData, e);
  }
  filterData.setSelectedFiltersList(filterData.selectedFiltersList);
}

export function removeFilter(data, filter, e) {
  const filterName = e.target.value,
    categorie = e.target.getAttribute('data-categorie'),
    deleteIndex = filter.selectedFiltersList.findIndex(
      element => element.value === filterName && categorie === element.categorie,
    );
  filter.selectedFiltersList.splice(deleteIndex, 1);
  if (!filter.selectedFiltersList.length) {
    filter.setPerformFiltering(false);
    filter.setFiltersSelected(false);
    data.setFilteredData([]);
    data.setTotalHits(data.flattenedData.length);
  }
  filter.setSelectedFiltersList(filter.selectedFiltersList);
}

export function resetState(data, mediaRequest, sort, filter, error) {
  data.setTotalHits(null);
  data.setNoResults(false);
  data.setFilteredData([]);
  data.setFlattenedData([]);
  mediaRequest.setAllRequestsMade(false);
  mediaRequest.setRequestMade(false);
  sort.setIsSortingSet(false);
  error.setIsError(false);
  filter.setSelectedFiltersList([]);
  filter.setPerformFiltering(false);
  filter.setFiltersSelected(false);
  filter.setFilters({});
}

export function setError(errMessage, mediaRequest, error) {
  mediaRequest.setIsDataLoading(false);
  mediaRequest.setAllRequestsMade(true);
  error.setIsError(true);
  error.setErrorMessage(`Ooops!..${errMessage}.<br/>Try to reload the page`);
}

export function changeBackground() {
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

export function sortByDirection(data, option, direction) {
  data.sort((a, b) => {
    const isA = typeof a[option] !== 'undefined',
      isB = typeof b[option] !== 'undefined';
    if (direction === 'ascending') {
      return isB - isA || (isA === true && a[option] - b[option]) || 0;
    } else {
      return isB - isA || (isA === true && b[option] - a[option]) || 0;
    }
  });
}

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
      description,
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
      description,
      mediaType: media_type,
      creator: getCreatorsList(secondary_creator),
    };
  });
}

export function getFiltersAndUpdate(flattenedData, metadata) {
  getFiltersFromMetadata(metadata, flattenedData);
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
    FILTERS_BY_MEDIA_TYPE[dataItem.mediaType].forEach(key => {
      if (!filtersContainer[key]) {
        filtersContainer[key] = {};
      }
      if (dataItem[key]) {
        if (Array.isArray(dataItem[key])) {
          dataItem[key].forEach(keyword => {
            updateFilterValue(filtersContainer[key], keyword);
          });
        } else {
          updateFilterValue(filtersContainer[key], dataItem[key]);
        }
      }
    });
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

export function showDescription(style, e) {
  Array.from(document.querySelectorAll(`.${style}`)).forEach(item =>
    item.classList.contains(`${style}`) &&
    item.id !== `description_${e.target.getAttribute('data-index')}`
      ? item.classList.remove(`${style}`)
      : '',
  );
  document
    .getElementById(`description_${e.target.getAttribute('data-index')}`)
    .classList.toggle(`${style}`);
}
