import express from "express";
import {
  materialController,
  simulationController,
} from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";

const route = express.Router();

route.get("/", authenticateUser, simulationController.index);
route.get("/:id", authenticateUser, simulationController.show);
route.get(
  "/materials/:simulationId",
  authenticateUser,
  materialController.show
);

export default route;
