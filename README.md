# NASA media search engine (NMSE) :rocket:
NMSE is based on the data received from the open APIs: [NASA Image and Video Library](https://images.nasa.gov/) and [APOD](https://apod.nasa.gov/apod/astropix.html).  
This application provides functionality to perform a search of media resources such as images, audio, and video by the given key term. For better user experience such features as sorting and filtering are supplied.

# Table of contents
- [About](#nasa-media-search-engine-nmse-rocket)
- [Key features](#key-features-key)
- [Additional features](#additional-features-star2)
- [Upcoming features](upcoming-features-fire)
- [Installation](#installation)

## Key features :key:
0. Searching by keywords  :sparkles:
1. Selection of media types to search for :sparkles:
2. For each media type **filtering** have to be performed by different categories: :sparkles:
   * **Video** filter by: keywords, location, photographer;
   * **Audio** filter by: keywords, center, bitrate;
   * **Image** filter by: keywords, center, creator, color space, image size, album.
3. For each media type **sorting** have to be performed differently: :sparkles:
   * **Video** sort by: creation date, duration, file size, frame rate;
   * **Audio** sort by: creation date, duration, file size, bitrate;
   * **Image** sort by: creation date, resolution.
4. Provision of description for an item if any :sparkles:
5. Display NASA "Picture Of the Day" as side content :sparkles:

### Additional features :star2:
0. Download button for images :sparkles:
1. Selection of resolution for images to download
2. Catalogue of Near Earth Objects (NEO)
3. Sorting of NEO by: magnitude, approach date, velocity
4. Recent NASA photo/video background for the main page

:sparkles: - *implemented features*

### Upcoming features :fire:
0. Media items pagination
1. Responsive layout

# Installation
1. Download the code from the `main` branch 
2. Unpack the code to the destination folder
3. Open the destination folder and run `npm i` or `npm install`
4. After the packages installation run `npm run start` or `npm start`
5. By default, code will run at `localhost:1234` 
