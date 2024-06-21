import { Storage } from "@google-cloud/storage";
import configs from "../configs/index.js";

const storage = new Storage();

const bucket = storage.bucket(configs.bucketName);

export default bucket;
