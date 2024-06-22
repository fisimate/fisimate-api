import express from "express";
import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import examBankRoute from "./examBank.route.js";
import materialBankRoute from "./materialBank.route.js";
import formulaBankRoute from "./formulaBank.route.js";
import simulationRoute from "./simulation.route.js";
import chapterRoute from "./chapter.route.js";
import dashboardRoute from "./dashboard.route.js";

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
  {
    path: "/formula-banks",
    route: formulaBankRoute,
  },
  {
    path: "/simulations",
    route: simulationRoute,
  },
  {
    path: "/chapters",
    route: chapterRoute,
  },
  {
    path: "/dashboard",
    route: dashboardRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
