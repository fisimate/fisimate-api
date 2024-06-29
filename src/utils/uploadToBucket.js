import bucket from "../lib/bucket.js";

export default function uploadToBucket(file, folderPath) {
  const randomString = generateRandomString(16);
  const customFileName = `${Date.now()}-${randomString}-${file.originalname}`;
  const filePath = folderPath
    ? `${folderPath}/${customFileName}`
    : customFileName; // Include the folder path in the file name
  const blob = bucket.file(filePath);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => reject(err));
    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });
    blobStream.end(file.buffer);
  });
}
