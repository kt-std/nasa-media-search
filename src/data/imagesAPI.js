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
  //respnseData=[];

  const { responseData, error } = await getDataPages(requestURL),
    dataReceived = await getAndPrepareMetadataForRendering(responseData, error);
  return { ...dataReceived, mediaTypes };
}

export async function requestCollectionAndMetadata(responseData) {
  let noResults = false;
  const flattenedData = getResponseData(responseData);
  if (!flattenedData.length) noResults = true;
  const collectionData = await getCollectionData(flattenedData);
  const metadataFromLinks = await getMetadata(flattenedData, collectionData);
  return { metadataFromLinks, flattenedData };
}

async function getDataPages(requestURL) {
  let pagesCounter = 0,
    allRequestsMade = false,
    responseData = [],
    error = { isError: false, errorMessage: '' };
  while (!allRequestsMade) {
    await fetch(requestURL)
      .then(data => data.json())
      .then(responseBody => {
        if (responseBody.collection.links) {
          const { nextPageLinkIndex, hasPage } = hasNextPage(responseBody.collection.links);
          if (pagesCounter === 2 || !hasPage) {
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
        error = { isError: true, errorMessage: errMsg };
        //setError(err, mediaRequest, error);
      });
  }
  return { responseData, error };
}

export async function getAndPrepareMetadataForRendering(responseData, error) {
  if (!error.isError) {
    const { metadataFromLinks, flattenedData, error } = await requestCollectionAndMetadata(
        responseData,
      ),
      { filters, totalHits } = await getFiltersAndUpdate(flattenedData, metadataFromLinks);
    changeBackground();
    return { filters, totalHits, flattenedData };
  }
}

async function getCollectionData(flattenedData) {
  const requests = flattenedData.map(dataItem => fetchData(dataItem.href));
  const data = await getAllPromisesData(requests);
  return data;
}

function getMetadataPromisesFromCollectionList(flattenedData, collectionData) {
  return collectionData.map((collectionDataItem, i) => {
    const metadataLink = getItemByStringPattern('metadata.json', collectionDataItem);
    flattenedData[i].metadata = replaceProtocolExtension(metadataLink);
    return fetchData(flattenedData[i].metadata);
  });
}

function getMetadata(flattenedData, collectionData) {
  const metadataFetchedLinks = getMetadataPromisesFromCollectionList(flattenedData, collectionData);
  return getAllPromisesData(metadataFetchedLinks);
}

function getAllPromisesData(data) {
  return Promise.all(data).then(responseData =>
    Promise.all(responseData.map(responseDataItem => responseDataItem.json())),
  );
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

export async function fetchData(url) {
  return await fetch(url).catch(err => {
    throw Error(err);
  });
  //setError(err, error)
}
