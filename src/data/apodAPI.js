export async function getPictureOfTheDay() {
  const requestURL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_APOD_KEY}&thumbs=true`;
  const pictureData = await fetch(requestURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error();
      }
    })
    .then(pictureData => pictureData)
    .catch(err => ({ isError: true, errorMessage: err.message }));
  if (!pictureData.isError) {
    const { thumbnail_url, title, date, url } = pictureData;
    return pictureData.media_type === 'video'
      ? { imageURL: thumbnail_url, title, date, isError: false }
      : { imageURL: url, title, date, isError: false };
  }
  return { ...pictureData };
}
