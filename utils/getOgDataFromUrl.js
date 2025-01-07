export const getOgDataFromUrl = async (url) => {
  try {
    const response = await fetch(
      `https://api.microlink.io?url=${encodeURIComponent(url)}`
    );
    const data = await response.json();

    const ogImageUrl = data?.data?.image?.url;
    const ogTitle = data?.data?.title;

    if (ogImageUrl && ogTitle) {
      return { image: ogImageUrl, title: ogTitle };
    } else {
      throw new Error("No OG data found.");
    }
  } catch (error) {
    throw new Error("Failed to fetch OG data.");
  }
};
