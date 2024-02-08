import express from "express";
import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import examBankRoute from "./examBank.route.js";
import materialBankRoute from "./materialBank.route.js";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/exam-banks",
    route: examBankRoute,
  },
  {
    path: "/material-banks",
    route: materialBankRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
