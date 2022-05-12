const express = require("express");
const cors = require("cors");
const morgan = require('morgan')
const helmet = require("helmet");
const CronJob = require('cron').CronJob
const logger = require("./config/logger");
const httpResponder = require("./utils/httpResponse");
const { StatusCodes } = require("http-status-codes");
const db = require("./models");
const routes = require("./routes");
const { resetCartStatus } = require("./schedulers/resetCartStatus");

// if you want to drop and re-sync db the database
// db.sequelize.sync({ force: true });

// to re-sync the database
db.sequelize.sync()

// Init express
const app = express();

app.disable("x-powered-by");

// Set security for HTTP headers
app.use(helmet());

app.use(cors());

// Development logging
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

// scheduler to change cart status for old carts runs every one hour
new CronJob('* */1 * * *', function () {
    resetCartStatus();
}, null, true)


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
