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

export function needToBeChecked(selectedMediaTypesValue, mediaType) {
  return selectedMediaTypesValue.length && selectedMediaTypesValue.indexOf(mediaType) !== -1
    ? true
    : false;
}

export function getCardStyling(mediaType, styles) {
  return mediaType === 'audio' ? styles.audio : mediaType === 'video' ? styles.video : styles.image;
}

export function getBackground(dataItem) {
  return dataItem.previewImage !== null ? dataItem.previewImage : require('../../assets/audio.svg');
}
export function setBackground(url) {
  return { backgroundImage: `url(${url}` };
}

export function searchByTerm(searchInputValue, media, e) {
  const { searchParams, error, data, mediaRequest, filter, sort } = media;
  e.preventDefault();
  searchParams.setMediaTypes(searchParams.selectedMediaTypes);
  searchParams.setSearchValue(searchInputValue);
  resetState(data, mediaRequest, sort, filter, error);
  mediaRequest.setIsDataLoading(true);
}

export function openHomePage(media, setSearchInputValue, e) {
  const { data, mediaRequest, searchParams, sort, filter, error } = media;
  e.preventDefault();
  mediaRequest.setRequestMade(false);
  searchParams.setSearchValue(null);
  setSearchInputValue('');
  searchParams.setMediaTypes([]);
  searchParams.setSelectedMediaTypes([]);
  resetState(data, mediaRequest, sort, filter, error);
  removeClass(`${styles.no_image__background}`, document.body);
}

export function updateData(dataParams, data, filter, searchParams) {
  const { filters, totalHits, flattenedData, mediaTypes, noResults } = dataParams;
  data.setTotalHits(totalHits);
  data.setNoResults(noResults);
  data.setFlattenedData(flattenedData);
  filter.setFilters(filters);
}

export function updateMediaTypes(selectedMediaTypesValue, setSelectedMediaTypes, input) {
  const mediaTypes = selectedMediaTypesValue.slice();
  const inputIndex = mediaTypes.indexOf(input.value);
  if (inputIndex === -1) {
    mediaTypes.push(input.value);
  } else {
    mediaTypes.splice(inputIndex, 1);
  }
  setSelectedMediaTypes(mediaTypes);
}

export function sortMedia(data, sort, filter, e) {
  const { mediaDataReceived, setCB } = filter.filtersSelected
      ? { mediaDataReceived: data.filteredData, setCB: data.setFilteredData }
      : { mediaDataReceived: data.flattenedData, setCB: data.setFlattenedData },
    [option, direction] = e.target.value.split('_');
  const mediaData = mediaDataReceived.slice();
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
    categorie = e.target.getAttribute('data-categorie'),
    selectedFiltersList = filterData.selectedFiltersList.slice();
  filterData.setFiltersSelected(true);
  if (!isFilterSelected(selectedFiltersList, filterValue, categorie)) {
    selectedFiltersList.push({ value: filterValue, categorie });
    filterData.setSelectedFiltersList(selectedFiltersList);
  } else {
    removeFilter(data, selectedFiltersList, filterData, e);
  }
}

export function removeFilter(data, selectedFilters, filter, e) {
  const filterName = e.target.value,
    categorie = e.target.getAttribute('data-categorie'),
    selectedFiltersList = selectedFilters.slice(),
    deleteIndex = selectedFiltersList.findIndex(
      element => element.value === filterName && categorie === element.categorie,
    );
  selectedFiltersList.splice(deleteIndex, 1);
  if (!selectedFiltersList.length) {
    filter.setPerformFiltering(false);
    filter.setFiltersSelected(false);
    data.setFilteredData([]);
    data.setTotalHits(data.flattenedData.length);
  }
  filter.setSelectedFiltersList(selectedFiltersList);
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
  )
    ? 'checked'
    : null;
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
  const SIZE_VALUE = { KB: 1, MB: 1024, GB: 1024 * 1024 };
  return { number, unit, value: getNumberFromString(number) * SIZE_VALUE[unit.toUpperCase()] };
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

export function showDescription(style, id, e) {
  Array.from(document.querySelectorAll(`.${style}`)).forEach(item => {
    if (item.classList.contains(`${style}`) && item.id !== id) {
      item.classList.remove(style);
    }
  });
  const target = document.getElementById(id);
  target.classList.contains(style) ? target.classList.remove(style) : target.classList.add(style);
}

export function leaveItemShown(e, id, style) {
  if (
    e.relatedTarget === null ||
    (e.relatedTarget.id !== id && e.relatedTarget.parentNode.id !== id)
  ) {
    document.getElementById(id).classList.remove(style);
  }
}
export function blurFromItem(e, style) {
  e.target.classList.contains(style)
    ? e.target.classList.remove(style)
    : e.target.parentNode.classList.remove(style);
}

export function blurItemInContainer(
  e,
  wrapper,
  checkboxName,
  setFocusInsideChild,
  setFocusOnSwitcher,
) {
  if (!e.relatedTarget || e.relatedTarget.id !== wrapper) {
    setFocusInsideChild(false);
    setFocusOnSwitcher(false);
  }
  if (e.relatedTarget && e.relatedTarget.name === checkboxName) {
    setFocusInsideChild(true);
  }
}

export function hideSwitcher(e, switcherId, inputName, inputContainer, setFocusOnSwitcher) {
  if (
    e.target.id === switcherId &&
    e.relatedTarget &&
    e.relatedTarget.name !== inputName &&
    e.relatedTarget.id !== inputContainer
  ) {
    setFocusOnSwitcher(false);
  }
  if (e.relatedTarget === null) {
    setFocusOnSwitcher(false);
  }
}

export function checkSwitcher(e, setFocusOnSwitcher, setFocusInsideChild) {
  if (e.target.checked) {
    setFocusOnSwitcher(true);
  } else {
    setFocusOnSwitcher(false);
    setFocusInsideChild(false);
  }
}

export function isDataCached(mediaTypes, searchValue, cache) {
  return cache[searchValue] && arraysEqual(cache[searchValue].mediaTypes, mediaTypes);
}

export function updateCache(cache, setCache, searchParams, dataReceived) {
  const cacheCopy = { ...cache };
  cacheCopy[searchParams.searchValue] = { data: dataReceived, mediaTypes: searchParams.mediaTypes };
  setCache(cacheCopy);
}

function arraysEqual(a1, a2) {
  return JSON.stringify(a1) == JSON.stringify(a2);
}
