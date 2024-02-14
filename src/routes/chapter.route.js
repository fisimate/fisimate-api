import express from "express";
import { chapterController } from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";

const route = express.Router();

route.get("/", authenticateUser, chapterController.index);

export default route;
