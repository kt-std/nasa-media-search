import {
  MEDIA_TYPE_SORTING_OPTIONS,
  SORTING_OPTIONS_TEXT,
  FILTERS_TEXT,
  FILTERS_BY_MEDIA_TYPE,
  RESPONSE_DATA_FILES,
} from './data.js';

import styles from './style.css';

//todo handle errors

export function hasFilteringParameters(filter) {
  return Object.keys(filter).length;
}

function getParametersFromNodeList(parameter, nodeList) {
  return Array.from(nodeList).map(item => item[parameter]);
}
export function isFilterSelected(filtersSelected, filterName, categorie) {
  return filtersSelected.some(
    filter => filter.categorie === categorie && filter.value === filterName,
  );
}

export function isOptionNeeded(storage, option) {
  return storage.mediaTypes.some(mediaType => {
    return MEDIA_TYPE_SORTING_OPTIONS[mediaType].indexOf(option) !== -1;
  });
}

export function isElementInArray(data, element) {
  return data.some(dataItem => dataItem.toUpperCase() === element);
}

export const sortByDirection = {
  ascending: function (data, option) {
    data.sort((current, next) => (current[option] ? current[option] - next[option] : true));
  },
  descending: function (data, option) {
    data.sort((current, next) => (current[option] ? next[option] - current[option] : true));
  },
};

export function resetState(storage) {
  storage.totalHits = null;
  storage.sortingSet = false;
  storage.requestMade = false;
  storage.selectedFiltersList = [];
  storage.performFiltering = false;
  storage.filtersSelected = false;
  storage.filters = {};
  storage.noResults = false;
  storage.allRequestsMade = false;
}

export async function prepareReponseDataForRendering(storage) {
  if (!storage.isError) {
    storage.flattenedData = getResponseData(storage);
    if (!storage.flattenedData.length) storage.noResults = true;
    const collectionData = await getCollectionData(storage.flattenedData, storage),
      metadataFromLinks = await getMetadata(storage.flattenedData, collectionData, storage);
    await getFiltersAndUpdate(storage, metadataFromLinks);
  }
  window.renderApp();
}

function getCollectionData(data, storage) {
  const requests = data.map(dataItem => fetch(dataItem.href));
  return getAllPromisesData(requests, storage);
}

function getMetadataLinksFromCollectionList(data, collectionData) {
  return collectionData.map((collectionDataItem, i) => {
    const metadataLink = getItemByStringPattern('metadata.json', collectionDataItem);
    data[i].metadata = replaceProtocolExtension(metadataLink);
    return fetch(data[i].metadata).catch(err => {
      setError(err, storage);
    });
  });
}

function getMetadata(data, collectionData, storage) {
  const metadataFetchedLinks = getMetadataLinksFromCollectionList(data, collectionData, storage);
  return getAllPromisesData(metadataFetchedLinks, storage);
}

function getAllPromisesData(data, storage) {
  return Promise.all(data)
    .then(responseData =>
      Promise.all(responseData.map(responseDataItem => responseDataItem.json())),
    )
    .catch(err => {
      setError(err, storage);
    });
}

function replaceProtocolExtension(link) {
  return link.replace(/(http)/gm, 'https');
}

function getFiltersAndUpdate(storage, metadata) {
  window.data.isDataLoading = false;
  changeStateToRequestMade(storage);
  getFiltersFromLists(storage.flattenedData, storage.mediaTypes, storage.filters);
  storage.totalHits = storage.flattenedData.length;
}

function getFiltersFromMetadata(metadata) {
  return metadata
    .then(metadataPromises => {
      return Promise.all(
        metadataPromises.map((metadata, i) => {
          getFiltersDataFromMetadata(metadata, data[i]);
        }),
      );
    })
    .catch(err => {
      setError(err, storage);
    });
}

export function removeClass(backgroundClassName, element) {
  element.classList.remove(backgroundClassName);
}

function addClass(backgroundClassName, element) {
  element.classList.add(backgroundClassName);
}

function getItemByStringPattern(str, data) {
  return data[data.findIndex(dataItem => dataItem.includes(str))];
}

function keywordIsASingleWord(keyword) {
  return keyword.split(' ').length === 1 && !parseInt(keyword);
}

function getResponseData(storage) {
  return getConciseContentFromRespond(storage.responseData);
}

function flat(array) {
  return array.reduce((acc, current) => acc.concat(current), []);
}

function getConciseContentFromRespond(items) {
  return items.map(item => {
    const { data, href, links: [{ href: previewImage }] = [{ href: null }] } = item;
    const { keywords, date_created, center, media_type, title, secondary_creator = null } = data[0];
    return {
      keywords: getOnlySingleWordKeyword(keywords),
      date: getSeconds(date_created),
      title,
      center,
      previewImage: removeSpacesFromLink(previewImage),
      href,
      mediaType: media_type,
      creator: getCreatorsList(secondary_creator),
    };
  });
}

function getSeconds(date) {
  return new Date(date).getTime();
}

function getOnlySingleWordKeyword(keywords) {
  return keywords ? keywords.filter(keyword => keywordIsASingleWord(keyword)) : 'unknown';
}

function getCreatorsList(creator) {
  return creator !== null ? splitStringWithDifferentSeparator(creator) : ['unknown'];
}

function splitStringWithDifferentSeparator(stringToSplit) {
  stringToSplit = stringToSplit.replace(/[<>]||(\/>)/gm, '');
  if (stringToSplit.indexOf('/') === -1) {
    return stringToSplit.split(', ');
  } else {
    return stringToSplit.split('/');
  }
}

function getFiltersDataFromMetadata(responseBody, dataItem) {
  const mediaMetadata = responseBody,
    mediaKeysNeeded = MEDATADA_KEYS_BY_MEDIA_TYPE[dataItem.mediaType];
  Object.keys(mediaKeysNeeded).forEach(key => {
    transformKeyValueToNumber(key, dataItem, mediaMetadata[mediaKeysNeeded[key]]);
  });
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

function getFiltersFromLists(data, mediaTypes, filtersContainer) {
  data.forEach(dataItem => {
    mediaTypes.forEach(mediaType => {
      FILTERS_BY_MEDIA_TYPE[mediaType].forEach(key => {
        if (!filtersContainer[key]) {
          filtersContainer[key] = {};
        }
        if (dataItem[key]) {
          if (Array.isArray(dataItem[key])) {
            dataItem[key].forEach(keyword => {
              if (mediaType === dataItem.mediaType) {
                updateFilterValue(filtersContainer[key], keyword);
              }
            });
          } else {
            updateFilterValue(filtersContainer[key], dataItem[key]);
          }
        }
      });
    });
  });
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

function getNumberFromString(value) {
  return value ? parseInt(value) : undefined;
}

export async function requestMedia(storage) {
  const searchInputValue = document.getElementById('searchInput').value,
    mediaTypes = getMediaTypes();
  let requestURL = createRequestURL(searchInputValue, mediaTypes);
  storage.mediaTypes = setSelectedMediaTypes(mediaTypes);
  storage.searchValue = searchInputValue;
  storage.responseData = [];
  let pagesCounter = 0;
  window.renderApp();
  let k = 0;
  while (!storage.allRequestsMade) {
    //todo add loading state
    await fetch(requestURL)
      .then(data => data.json())
      .then(data => {
        if (data.collection.links) {
          const { nextPageLinkIndex, hasPage } = hasNextPage(data.collection.links);
          if (pagesCounter === 2 || !hasPage) {
            storage.allRequestsMade = true;
          } else {
            requestURL = replaceProtocolExtension(data.collection.links[nextPageLinkIndex].href);
            pagesCounter++;
          }
        } else {
          storage.allRequestsMade = true;
        }
        storage.responseData = storage.responseData.concat(data.collection.items);
      })
      .catch(err => {
        setError(err, storage);
      });
  }
  await prepareReponseDataForRendering(window.data);
}

function setError(errMessage, storage) {
  storage.isDataLoading = false;
  storage.allRequestsMade = true;
  storage.isError = true;
  storage.errorMessage = `Ooops!..${errMessage}.<br/>Try to reload the page`;
  window.renderApp();
}

function hasNextPage(linksList) {
  const nextPageLinkIndex = linksList.findIndex((linkItem, i) => linkItem.rel === 'next');
  return nextPageLinkIndex !== -1
    ? { hasPage: true, nextPageLinkIndex }
    : { hasPage: false, nextPageLinkIndex };
}
function changeStateToRequestMade(storage) {
  storage.requestMade = true;
  addClass(`${styles.no_image__background}`, document.body);
}

function createRequestURL(searchInputValue, mediaTypes) {
  const API_URL = 'https://images-api.nasa.gov/search';
  return `${API_URL}?q=${searchInputValue}${
    mediaTypes.length ? `&media_type=${mediaTypes.join(',')}` : ''
  }`;
}

function removeSpacesFromLink(link) {
  return link !== null ? link.split(' ').join('%20') : null;
}

function setSelectedMediaTypes(mediaTypes) {
  return mediaTypes.length ? mediaTypes : null;
}

function getMediaTypes() {
  const mediaTypes = document.querySelectorAll('input[name="mediaType"]:checked');
  return getParametersFromNodeList('value', mediaTypes);
}

const MEDATADA_KEYS_BY_MEDIA_TYPE = {
  video: {
    location: 'AVAIL:Location',
    framerate: 'QuickTime:VideoFrameRate',
    duration: 'QuickTime:Duration',
    size: 'File:FileSize',
  },
  image: {
    colorSpace: 'EXIF:ColorSpace',
    size: 'File:FileSize',
    resolution: 'Composite:ImageSize',
    album: 'AVAIL:Album',
  },
  audio: {
    bitrate: 'MPEG:AudioBitrate',
    duration: 'Composite:Duration',
    size: 'File:FileSize',
  },
};
