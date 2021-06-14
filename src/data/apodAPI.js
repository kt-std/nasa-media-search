export async function getPictureOfTheDay() {
  try {
    const requestURL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_APOD_KEY}&thumbs=true&start_date=2021-06-13&end_date=2021-06-13`;
    const response = await fetch(requestURL);
    if (!response.ok) {
      throw new Error(
        `An error occured while trying to fetch data from APOD API. Status: ${response.status}`,
      );
    } else {
      const pictureData = await response.json();
      const { thumbnail_url, title, date, url } = pictureData;
      return pictureData.media_type === 'video'
        ? { imageURL: thumbnail_url, title, date, isError: false }
        : { imageURL: url, title, date, isError: false };
    }
  } catch (err) {
    return { isError: true, errorMessage: err.message };
  }
}
