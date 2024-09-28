import { env } from "./config/env.js";
import express from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import bodyParser from "body-parser";
import routes from "./routes/index.js";
import error from "./middlewares/error.js";
import { swaggerSpec, swaggerUi } from "./config/swagger.js";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();

if (env("NODE_ENV") !== "production") {
  app.use(morgan("dev"));
}

// Swagger UI setup
app.use(
  "/api-docs/swagger-ui.css",
  express.static(
    path.join(__dirname, "node_modules/swagger-ui-dist/swagger-ui.css")
  )
);
app.use(
  "/api-docs/index.css",
  express.static(path.join(__dirname, "node_modules/swagger-ui-dist/index.css"))
);
app.use(
  "/api-docs/swagger-ui-bundle.js",
  express.static(
    path.join(__dirname, "node_modules/swagger-ui-dist/swagger-ui-bundle.js")
  )
);
app.use(
  "/api-docs/swagger-ui-standalone-preset.js",
  express.static(
    path.join(
      __dirname,
      "node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js"
    )
  )
);
app.use(
  "/api-docs/swagger-ui-standalone-preset.js",
  express.static(
    path.join(
      __dirname,
      "node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js"
    )
  )
);
app.use(
  "/api-docs/favicon-32x32.png",
  express.static(
    path.join(__dirname, "node_modules/swagger-ui-dist/favicon-32x32.png")
  )
);
app.use(
  "/api-docs/favicon-16x16.png",
  express.static(
    path.join(__dirname, "node_modules/swagger-ui-dist/favicon-16x16.png")
  )
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Setup http security headers
app.use(helmet());

// parse json request body
app.use(bodyParser.json());

// parse urlencoded request body
app.use(bodyParser.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
// app.options('*', cors);

// v1 api routes
app.use("/v1", routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

export default app;
