import bucket from "../lib/bucket.js";

export default async function deleteFromBucket(filePath) {
  try {
    const file = bucket.file(filePath);

    await file.delete();

    return;
  } catch (error) {
    throw new Error(error);
  }
}
