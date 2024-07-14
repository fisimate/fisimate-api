const extractFilePath = (url) => {
  const baseUrl = "https://storage.googleapis.com/";

  if (!url.startsWith(baseUrl)) {
    throw new Error("Invalid file URL");
  }

  const filePath = url.slice(baseUrl.length);

  return filePath;
};

export default extractFilePath;
