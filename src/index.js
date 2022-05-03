const { app } = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");

// Start Server
app.listen(config.port, () =>
    console.log(`App listening on port - ${config.port}`),
    logger.info(`App listening on port - ${config.port}`)

);
