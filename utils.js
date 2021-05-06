export function getRandomInexInRange(maxValue) {
  return Math.floor(Math.random() * maxValue);
}

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

export const keysForMetadataByMediaType = {
  video: {
    location: 'AVAIL:Location',
    photographer: 'AVAIL:Photographer',
    framerate: 'QuickTime:VideoFrameRate',
    duration: 'QuickTime:Duration',
    size: 'File:FileSize',
  },
  image: {
    creator: 'XMP:Creator',
    colorSpace: 'EXIF:ColorSpace',
    size: 'File:FileSize',
    resolution: 'Composite:ImageSize',
    album: 'AVAIL:Album',
  },
  audio: {
    bitrate: 'MPEG:AudioBitrate',
    duration: 'QuickTime:Duration',
    size: 'File:FileSize',
  },
};

export function removeSpacesFromLink(link) {
  return link !== null ? link.split(' ').join('%20') : null;
}
