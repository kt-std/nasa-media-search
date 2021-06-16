import { getFiltersAndUpdate, getResponseData } from './mediaData';
import { replaceProtocolExtension, getItemByStringPattern } from '../utils';

export async function requestMedia(mediaTypes, searchInputValue) {
  const requestURL = createRequestURL(searchInputValue, mediaTypes),
    { responseData, error } = await getDataPages(requestURL);
  if (error.responseOk) {
    const dataReceived = await getAndPrepareMetadataForRendering(responseData);
    return { ...dataReceived, mediaTypes };
  }
  return { ...error, mediaTypes };
}

export async function requestCollectionAndMetadata(responseData) {
  const flattenedData = getResponseData(responseData);
  const collectionData = await getCollectionData(flattenedData);
  if (collectionData.responseOk) {
    const metadataFromLinks = await getMetadata(flattenedData, collectionData.data);
    return { data: metadataFromLinks, flattenedData };
  }
  return { data: collectionData, flattenedData };
}

async function getDataPages(requestURL) {
  let pagesCounter = 0,
    maxPageNumber = 1,
    allRequestsMade = false,
    responseData = [],
    error = { responseOk: true, errorText: '' };
  while (!allRequestsMade) {
    try {
      const response = await fetch(requestURL);
      if (!response.ok) {
        throw new Error(response.statusText);
      } else {
        const responseBody = await response.json();
        if (responseBody.collection.links) {
          const { nextPageLinkIndex, hasPage } = hasNextPage(responseBody.collection.links);
          if (pagesCounter === maxPageNumber || !hasPage) {
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
      }
    } catch (errMsg) {
      allRequestsMade = true;
      error = { responseOk: false, errorText: errMsg.message || errMsg };
    }
  }
  return { responseData, error };
}

export async function getAndPrepareMetadataForRendering(responseData) {
  const { data: metadataFromLinks, flattenedData } = await requestCollectionAndMetadata(
    responseData,
  );
  if (flattenedData.length && metadataFromLinks.responseOk) {
    const { filters, totalHits } = await getFiltersAndUpdate(flattenedData, metadataFromLinks.data);
    return { filters, totalHits, flattenedData, responseOk: true };
  }
  return { filters: {}, totalHits: null, flattenedData: [], ...metadataFromLinks };
}

async function getCollectionData(flattenedData) {
  const requests = flattenedData.map(dataItem => fetch(dataItem.href));
  return getAllPromisesData(requests);
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
  const error = { responseOk: false, errorText: 'Try to reload the page' };
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
      ),
    )
    .then(data => ({ data: data, responseOk: true }))
    .catch(err => error);
}

function hasNextPage(linksList) {
  const nextPageLinkIndex = linksList.findIndex((linkItem, i) => linkItem.rel === 'next');
  return { hasPage: nextPageLinkIndex !== -1, nextPageLinkIndex };
}

function createRequestURL(searchInputValue, mediaTypes) {
  const API_URL = 'https://images-api.nasa.gov/search';
  return `${API_URL}?q=${searchInputValue}${
    mediaTypes.length ? `&media_type=${mediaTypes.join(',')}` : ''
  }`;
}
