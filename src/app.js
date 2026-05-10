import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import "dotenv/config";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import apiRouter from "./routes/api.js";
import uiRouter from "./routes/ui.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();


// view engine setup
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "../public")));

app.use("/", uiRouter);
app.use("/api", apiRouter);

export default app;
