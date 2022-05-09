const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("./config/logger");
const httpResponder = require("./utils/httpResponse");
const { StatusCodes } = require("http-status-codes");
const db = require("./models");
const routes = require("./routes");

// const run = async () => {
// };
// // db.sequelize.sync({ force: true });
// db.sequelize.sync().then(() => {
//   console.log("Drop and re-sync db.");
//   run();
// });

db.sequelize.sync()

// Init express
const app = express();

app.disable("x-powered-by");

// Set security for HTTP headers
app.use(helmet());

app.use(cors());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));


// Routes
app.use(routes);

// handle errors
app.all("/*", (req, res) => {
    return httpResponder.errorResponse(
        res,
        "not_found",
        StatusCodes.NOT_FOUND
    );
});

app.use((err, req, res) => {
    logger.error(JSON.stringify(err.stack));
    return httpResponder.errorResponse(
        res,
        err.message,
        err.status || StatusCodes.INTERNAL_SERVER_ERROR
    );
});


module.exports = { app };
