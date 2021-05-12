import { audioContent } from './audio.js';
import { audioCollection } from './audio_collection';
import { audioMetadata } from './audio_metadata';
import { videoContent } from './video';
import { videoCollection } from './video_collection';
import { videoMetadata } from './video_metadata';
import { imageContent } from './image';
import { imageCollection } from './image_collection';
import { imageMetadata } from './image_metadata';

export const RESPONSE_DATA_FILES = {
  audio: {
    content: audioContent,
    collection: audioCollection,
    metadata: audioMetadata,
  },
  image: {
    content: imageContent,
    collection: imageCollection,
    metadata: imageMetadata,
  },
  video: {
    content: videoContent,
    collection: videoCollection,
    metadata: videoMetadata,
  },
};

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
