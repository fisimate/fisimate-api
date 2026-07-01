import randomString from "../lib/crypto.js";
import path from "path";
import supabase from "../lib/supabase.js";
import configs from "../configs/index.js";

export default function uploadToBucket(file, folderPath) {
  const fileExt = path.extname(file.originalname);
  const customFileName = randomString(14) + fileExt;
  const filePath = folderPath
    ? `${folderPath}/${customFileName}`
    : customFileName; // Include the folder path in the file name

  const bucket = supabase.storage.from(configs.supabaseBucketName);

  return bucket
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    })
    .then(({ data, error }) => {
      if (error) {
        throw error;
      }
      return bucket.getPublicUrl(data.path).data.publicUrl;
    })
    .catch((error) => {
      console.error("Error uploading file:", error);
      throw error;
    });
}
