export function getParametersFromNodeList(parameter, nodeList) {
  return Array.from(nodeList).map(item => item[parameter]);
}

export function getSeconds(date) {
  return new Date(date).getTime();
}

export function flat(array) {
  return array.reduce((acc, current) => acc.concat(current), []);
}

export function addClass(backgroundClassName, element) {
  element.classList.add(backgroundClassName);
}

export function removeClass(backgroundClassName, element) {
  element.classList.remove(backgroundClassName);
}

export function getIndexByString(str, data) {
  return data.filter(dataItem => dataItem.includes(str));
}

export function keywordIsASingleWord(keyword) {
  return keyword.split(' ').length === 1 && !parseInt(keyword);
}

export function removeSpacesFromLink(link) {
  return link !== null ? link.split(' ').join('%20') : null;
}
/*
export function calculateTotalHits(totalHitsStored, total_hits) {
  return totalHitsStored ? (totalHitsStored += total_hits) : total_hits;
}*/

export function getDurationValueFromString(duration) {
  if (duration) {
    const time = duration.match(/\d{1,}:\d{2}:\d{2}/g)[0];
    return getSecondsFromDurationValue(time);
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

export function getConciseContentFromRespond(storage, respondBody) {
  const {
    collection: {
      items,
      metadata: { total_hits },
    },
  } = respondBody;
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

function getOnlySingleWordKeyword(keywords) {
  return keywords.filter(keyword => keywordIsASingleWord(keyword));
}

function getCreatorsList(creator) {
  return creator !== null ? splitStringWithDifferentSeparator(creator) : ['unknown'];
}

function splitStringWithDifferentSeparator(stringToSplit) {
  if (stringToSplit.indexOf('/') === -1) {
    return stringToSplit.split(', ');
  } else {
    return stringToSplit.split('/');
  }
}

export const MEDATADA_KEYS_BY_MEDIA_TYPE = {
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
