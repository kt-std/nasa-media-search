import {
  getMediaTypes,
  setSelectedMediaTypes,
  getFiltersAndUpdate,
  getResponseData,
  changeStateToRequestMade,
  setError,
} from './mediaData';
import renderApp from '../framework/renderer';

import { replaceProtocolExtension, getItemByStringPattern } from '../utils';

export async function requestMedia(storage) {
  const searchInputValue = document.getElementById('searchInput').value,
    mediaTypes = getMediaTypes();
  let requestURL = createRequestURL(searchInputValue, mediaTypes);
  storage.mediaTypes = setSelectedMediaTypes(mediaTypes);
  storage.searchValue = searchInputValue;
  storage.responseData = [];

  renderApp();

  await getDataPages(storage, requestURL);
  await getAndPrepareMetadataForRendering(storage);
}

export async function requestCollectionAndMetadata(
  responseData,
  isError,
  flattenedData,
  noResults,
) {
  if (!isError) {
    flattenedData = getResponseData(responseData);
    if (!flattenedData.length) noResults = true;
    const collectionData = await getCollectionData(flattenedData, storage),
      metadataFromLinks = await getMetadata(storage.flattenedData, collectionData, storage);
    return metadataFromLinks;
  }
}

async function getDataPages(storage, requestURL) {
  let pagesCounter = 0;
  while (!storage.allRequestsMade) {
    await fetch(requestURL)
      .then(data => data.json())
      .then(responseBody => {
        if (responseBody.collection.links) {
          const { nextPageLinkIndex, hasPage } = hasNextPage(responseBody.collection.links);
          if (pagesCounter === 2 || !hasPage) {
            storage.allRequestsMade = true;
          } else {
            requestURL = replaceProtocolExtension(
              responseBody.collection.links[nextPageLinkIndex].href,
            );
            pagesCounter++;
          }
        } else {
          storage.allRequestsMade = true;
        }
        storage.responseData = storage.responseData.concat(responseBody.collection.items);
      })
      .catch(err => {
        setError(err, storage);
      });
  }
}

export async function getAndPrepareMetadataForRendering(storage) {
  const metadataFromLinks = await requestCollectionAndMetadata(storage);
  await getFiltersAndUpdate(storage, metadataFromLinks);
  changeStateToRequestMade(requestMade);
  renderApp();
}

function getCollectionData(data, storage) {
  const requests = data.map(dataItem => fetchData(dataItem.href, storage));
  return getAllPromisesData(requests, storage);
}

function getMetadataPromisesFromCollectionList(data, collectionData, storage) {
  return collectionData.map((collectionDataItem, i) => {
    const metadataLink = getItemByStringPattern('metadata.json', collectionDataItem);
    data[i].metadata = replaceProtocolExtension(metadataLink);
    return fetchData(data[i].metadata, storage);
  });
}

function getMetadata(data, collectionData, storage) {
  const metadataFetchedLinks = getMetadataPromisesFromCollectionList(data, collectionData, storage);
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

function fetchData(url, storage) {
  return fetch(url).catch(err => setError(err, storage));
}
