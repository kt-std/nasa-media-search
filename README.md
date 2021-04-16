# NASA media search engine (NMSE) :rocket:
NMSE is based on the data received from the open APIs: [NASA Image and Video Library](https://images.nasa.gov/) and [APOD](https://apod.nasa.gov/apod/astropix.html).  
This application provides functionality to perform a search of media resources such as images, audio, and video by the given key term. For better user experience such features as sorting and filtering are supplied.

## Key features :key:
0. Searching by keywords
1. Selection of media types to search for
2. For each media type **filtering** have to be performed by different categories:
   * **Video** filter by: keywords, location, photographer;
   * **Audio** filter by: keywords, center, bitrate;
   * **Image** filter by: keywords, center, creator, color space, image size, album.
3. For each media type **sorting** have to be performed differently:
   * **Video** sort by: creation date, duration, file size, frame rate;
   * **Audio** sort by: creation date, duration, file size, bitrate;
   * **Image** sort by: creation date, resolution.
4. Recent NASA photo/video background for the main page
5. Provision of description for an item if any

### Additional features :star:
0. Download button for images
1. Selection of resolution for images to download
2. Catalogue of Near Earth Objects (NEO)
3. Sorting of NEO by: magnitude, approach date, velocity
