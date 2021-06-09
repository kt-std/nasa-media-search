import {
  getMediaTypes,
  setSelectedMediaTypes,
  getFiltersAndUpdate,
  getResponseData,
  changeBackground,
  setError,
} from './mediaData';
import renderApp from '../framework/renderer';
import { replaceProtocolExtension, getItemByStringPattern } from '../utils';

export async function requestMedia() {
  const data = {};
  const searchInputValue = document.getElementById('searchInput').value,
    mediaTypes = getMediaTypes();
  let requestURL = createRequestURL(searchInputValue, mediaTypes);

  const { responseData, error } = await getDataPages(requestURL);
  if (!error.isError) {
    const dataReceived = await getAndPrepareMetadataForRendering(responseData);
    return { ...dataReceived, mediaTypes };
  }
  return { ...error, mediaTypes };
}

export async function requestCollectionAndMetadata(responseData) {
  let noResults = false;
  const flattenedData = getResponseData(responseData);
  if (!flattenedData.length) noResults = true;
  const collectionData = await getCollectionData(flattenedData);
  if (!collectionData.isError) {
    const metadataFromLinks = await getMetadata(flattenedData, collectionData);
    return { data: metadataFromLinks, flattenedData, noResults };
  }
  return { data: collectionData, flattenedData, noResults };
}

async function getDataPages(requestURL) {
  let pagesCounter = 0,
    allRequestsMade = false,
    responseData = [],
    error = { isError: false, errorText: '' };
  while (!allRequestsMade) {
    await fetch(requestURL)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          allRequestsMade = true;
          throw Error(response);
        }
      })
      .then(responseBody => {
        if (responseBody.collection.links) {
          const { nextPageLinkIndex, hasPage } = hasNextPage(responseBody.collection.links);
          if (pagesCounter === 1 || !hasPage) {
            allRequestsMade = true;
          } else {
            requestURL = replaceProtocolExtension(
              responseBody.collection.links[nextPageLinkIndex].href,
            );
            pagesCounter++;
          }
        } else {
          allRequestsMade = true;
        }
        responseData = responseData.concat(responseBody.collection.items);
      })
      .catch(errMsg => {
        allRequestsMade = true;
        error = { isError: true, errorText: errMsg };
      });
  }
  return { responseData, error };
}

export async function getAndPrepareMetadataForRendering(responseData) {
  const { data: metadataFromLinks, flattenedData, noResults } = await requestCollectionAndMetadata(
    responseData,
  );
  changeBackground();
  if (!noResults && !metadataFromLinks.isError) {
    const { filters, totalHits } = await getFiltersAndUpdate(flattenedData, metadataFromLinks);
    return { filters, noResults, totalHits, flattenedData, isError: false };
  }
  return { filters: {}, noResults, totalHits: null, flattenedData: [], ...metadataFromLinks };
}

async function getCollectionData(flattenedData) {
  const requests = await flattenedData.map(dataItem => fetch(dataItem.href));
  const data = await getAllPromisesData(requests);
  return data;
}

function getMetadataPromisesFromCollectionList(flattenedData, collectionData) {
  return collectionData.map((collectionDataItem, i) => {
    const metadataLink = getItemByStringPattern('metadata.json', collectionDataItem),
      downloadLink = getItemByStringPattern('~orig', collectionDataItem);
    flattenedData[i].metadata = replaceProtocolExtension(metadataLink);
    flattenedData[i].download = replaceProtocolExtension(downloadLink);
    return fetch(flattenedData[i].metadata);
  });
}

function getMetadata(flattenedData, collectionData) {
  const metadataFetchedLinks = getMetadataPromisesFromCollectionList(flattenedData, collectionData);
  return getAllPromisesData(metadataFetchedLinks);
}

function getAllPromisesData(data) {
  const error = { isError: true, errorText: 'Try to reload the page' };
  return Promise.all(data)
    .then(responseData =>
      Promise.all(
        responseData.map(responseDataItem => {
          if (responseDataItem.ok) {
            return responseDataItem.json();
          } else {
            throw Error(responseData);
          }
        }),
      ).catch(err => error),
    )
    .catch(err => error);
}

function hasNextPage(linksList) {
  const nextPageLinkIndex = linksList.findIndex((linkItem, i) => linkItem.rel === 'next');
  return nextPageLinkIndex !== -1
    ? { hasPage: true, nextPageLinkIndex }
    : { hasPage: false, nextPageLinkIndex };
}

function createRequestURL(searchInputValue, mediaTypes) {
  const API_URL = 'https://images-api.nasa.gov/search';
  return `${API_URL}?q=${searchInputValue}${
    mediaTypes.length ? `&media_type=${mediaTypes.join(',')}` : ''
  }`;
}
