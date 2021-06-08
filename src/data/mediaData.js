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

export function openHomePage(media, e) {
  const { data, mediaRequest, searchParams, sort, filter } = media;
  e.preventDefault();
  mediaRequest.setRequestMade(false);
  searchParams.setSearchValue(null);
  searchParams.setMediaTypes([]);
  resetState(data, mediaRequest, sort, filter);
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
  // console.log(e.target.value, mediaData.map(i=>i[option]));
  sortByDirection[direction](mediaData, option);
  // console.log(mediaData.map(i=>i[option]));
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
  //storage.focusOnFilter = null;
}

export function selectFilter(data, filterData, e) {
  const filterValue = e.target.value,
    categorie = e.target.getAttribute('data-categorie');
  filterData.setFiltersSelected(true);
  if (!isFilterSelected(filterData.selectedFiltersList, filterValue, categorie)) {
    // console.log(filterData.selectedFiltersList);
    filterData.selectedFiltersList.push({ value: filterValue, categorie });
    // console.log(filterData.selectedFiltersList);
    //storage.focusOnFilter = e.target.name;
  } else {
    removeFilter(data, filterData, e);
    //storage.focusOnFilter = null;
  }
  filterData.setSelectedFiltersList(filterData.selectedFiltersList);
}

export function removeFilter(data, filter, e) {
  const filterName = e.target.value,
    categorie = e.target.getAttribute('data-categorie'),
    deleteIndex = filter.selectedFiltersList.findIndex(
      element => element.value === filterName && categorie === element.categorie,
    );
  // storage.focusOnFilter = null;
  filter.selectedFiltersList.splice(deleteIndex, 1);
  //check value
  if (!filter.selectedFiltersList.length) {
    filter.setPerformFiltering(false);
    data.setFilteredData([]);
    filter.setFiltersSelected(false);
    // effect?
    data.setTotalHits(data.flattenedData.length);
  }

  filter.setSelectedFiltersList(filter.selectedFiltersList);
}

export function resetState(data, mediaRequest, sort, filter) {
  data.setTotalHits(null);
  data.setNoResults(false);
  data.setFilteredData([]);
  data.setFlattenedData([]);
  mediaRequest.setAllRequestsMade(false);
  mediaRequest.setRequestMade(false);
  sort.setIsSortingSet(false);
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
