
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const httpResponder = require("../utils/httpResponse");
const api = require("./v1");

const router = express.Router();

router.use("/api/v1", api);

router.get("/health", (req, res) => {
	return httpResponder.successResponse(res, {}, "Moccasin Store API is up & running", StatusCodes.OK, {});
});

router.get("/", (req, res) => {
	return httpResponder.successResponse(
		res,
		{ github: "https://github.com/anjorlar/moccasinStore.git" },
		"Welcome to Moccasin Store API",
		StatusCodes.OK,
	);
});

module.exports = router;
