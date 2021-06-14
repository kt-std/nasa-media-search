export async function getPictureOfTheDay() {
  try {
    const requestURL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_APOD_KEY}&thumbs=true`;
    const response = await fetch(requestURL);
    if (!response.ok) {
      throw new Error(
        `An error occured while trying to fetch data from APOD API. Status: ${response.status}`,
      );
    } else {
      const { thumbnail_url, title, date, url, media_type } = await response.json();
      return {
        imageURL: media_type === 'video' ? thumbnail_url : url,
        title,
        date,
        responseOk: true,
      };
    }
  } catch (err) {
    return { responseOk: false, errorMessage: err.message };
  }
}
