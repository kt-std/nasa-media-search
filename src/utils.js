export function hasFilteringParameters(filter) {
  return Object.keys(filter).length;
}

export function isElementInArray(data, element) {
  return data.some(dataItem => dataItem.toUpperCase() === element);
}

export function getNumberFromString(value) {
  return value ? parseInt(value) : undefined;
}

export function getSeconds(date) {
  return new Date(date).getTime();
}

export function removeSpacesFromLink(link) {
  return link !== null ? link.split(' ').join('%20') : null;
}

export function replaceProtocolExtension(link) {
  return link.replace(/(http)/gm, 'https');
}

export function fetchData(url, storage) {
  return fetch(url).catch(err => setError(err, storage));
}

export function flat(array) {
  return array.reduce((acc, current) => acc.concat(current), []);
}

export function getParametersValueFromNodeList(parameter, nodeList) {
  return Array.from(nodeList).map(item => item[parameter]);
}

export function removeClass(className, element) {
  element.classList.remove(className);
}

export function addClass(className, element) {
  element.classList.add(className);
}

export function getItemByStringPattern(str, data) {
  return data[data.findIndex(dataItem => dataItem.includes(str))];
}

export function keywordIsASingleWord(keyword) {
  return keyword.split(' ').length === 1 && !parseInt(keyword);
}
