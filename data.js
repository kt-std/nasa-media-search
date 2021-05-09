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

//creator === photographer
export const FILTERS_BY_MEDIA_TYPE = {
  video: ['keywords', 'location', 'creator'],
  audio: ['keywords', 'center', 'bitrateValue'],
  image: ['keywords', 'creator', 'center', 'colorSpace', 'resolutionValue', 'album'],
};
