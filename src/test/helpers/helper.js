const request = require("supertest");
const { app } = require("../../app");

exports.loginUser = async (email, password) => {
	return request(app).post("/api/v1/login").send({
		email: email,
		password: password,
	});
}
