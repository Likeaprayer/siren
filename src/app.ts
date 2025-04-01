import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import routes from "./router";
import { Authorize } from "./common/middleware/auth.middleware";
import { errorHandlingMiddleware } from "./common/middleware/error.middleware";


//TODO: add cors

const app = express();
dotenv.config();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(Authorize())

app.use('/api',routes);


app.use(errorHandlingMiddleware)

export default app;