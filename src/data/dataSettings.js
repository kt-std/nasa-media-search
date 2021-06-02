export const FILTERS_BY_MEDIA_TYPE = {
  video: ['keywords', 'location', 'creator'],
  audio: ['keywords', 'center', 'bitrate'],
  image: ['keywords', 'creator', 'center', 'colorSpace', 'resolutionOrigin', 'album'],
};

export const FILTERS_TEXT = {
  keywords: 'key terms',
  location: 'location',
  center: 'center',
  creator: 'media creator',
  bitrate: 'audio bitrate',
  colorSpace: 'image color space',
  resolutionOrigin: 'image resolution',
  album: 'image album',
};

export const MEDIA_TYPE_SORTING_OPTIONS = {
  video: ['duration', 'date', 'sizeValue', 'framerate'],
  audio: ['duration', 'date', 'sizeValue', 'bitrateValue'],
  image: ['date', 'sizeValue', 'resolutionValue'],
};

export const SORTING_OPTIONS_TEXT = {
  duration: 'duration',
  date: 'creation date',
  sizeValue: 'file size',
  framerate: 'frame rate',
  bitrateValue: 'bitrate',
  resolutionValue: 'resolution',
};

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
