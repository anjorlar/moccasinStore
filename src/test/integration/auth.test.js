const { expect } = require('chai');
const request = require("supertest");
const { app } = require("./../../app");


describe("User", () => {
    describe("Create User", () => {
        it("should register and return a new user", (done) => {
            const user = {
                name: "Giwa Tajudeen",
                email: "dev@mail.com",
                password: "password",
                address: "4rc drive off folks road haven land",
            };
            request(app)
                .post("/api/v1/register")
                .send(user)
                .expect(201)
                .expect((res) => {
                    expect(res.body.data.user).haveOwnProperty("name", 'Giwa Tajudeen');
                    expect(res.body.data.user).haveOwnProperty("email");
                    expect(res.body.data.user).haveOwnProperty("address");
                    expect(res.body.data).haveOwnProperty("token");
                })
                .end(done);
        });
        it("should return a 400 if all required fields are missing", (done) => {
            request(app)
            .post("/api/v1/register")
            .send({}).
            expect(400).end(done);
        });
        it("should return a 400 if one of the required fields is missing", (done) => {
            request(app)
            .post("/api/v1/register")
            .send({}).
            expect(400).end(done);
        });
        it("should not create user if email in use", (done) => {
            request(app)
                .post("/api/v1/register")
                .send({
                    email: 'lordsylharx@gmail.com',
                    password: "johndoe"
                })
                .expect(400)
                .end(done);
        });
    });
    describe("Login", () => {
        it("should login user and return auth token", (done) => {
            request(app)
                .post("/api/v1/login")
                .send({
                    email: 'lordsylharx@gmail.com',
                    password: "johndoe",
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.data).haveOwnProperty("token");
                })
                .end(done);
        });
        it("should reject invalid login", (done) => {
            request(app)
                .post("/api/v1/login")
                .send({
                    email: 'mosh@gmail.com',
                    password: "passwordfake",
                })
                .expect(401)
                .end(done);
        });
    });
});
