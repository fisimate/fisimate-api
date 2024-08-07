import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import http from "http";
import errorHandlerMiddleware from "./middlewares/handleError.js";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";
import handleNotFoundRoute from "./middlewares/notFoundRoute.js";
import compression from "compression";
import xss from "./middlewares/xss.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// const options = {
//   key: fs.readFileSync(path.join(configs.certLocation, "key.pem")),
//   cert: fs.readFileSync(path.join(configs.certLocation, "cert.pem")),
// };

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(xss());

app.use("/storage", express.static("public"));

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  return res.json("Hello world");
});

app.use(errorHandlerMiddleware);
app.use(handleNotFoundRoute);

// const server = https.createServer(options, app);
const server = http.createServer(app);

server.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
