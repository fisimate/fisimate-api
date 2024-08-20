import { Storage } from "@google-cloud/storage";
import configs from "../configs/index.js";

const storage = new Storage({
  keyFilename: "./src/secrets/key.json",
});

const bucket = storage.bucket(configs.bucketName);

export default bucket;
