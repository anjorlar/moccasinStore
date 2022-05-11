const { expect } = require('chai');
const request = require("supertest");
const { app } = require("./../../app");
const { loginUser } = require("../helpers/helper");


describe("Product", () => {
    let loggedInUser
    beforeEach(async function () {
        loggedInUser = await loginUser('gracejohn@gmail.com', 'graceeee1');
        console.error('>>>>> loggedInUser', loggedInUser.body.data.token);

    });
    describe("gets all Product", () => {
        it('should return a 401 if no token', (done) => {
            request(app)
                .get("/api/v1/product/view-active-product")
                .expect(401)
                .end(done)
        })

        it('should return a product', (done) => {
            request(app)
                .get("/api/v1/product/view-active-product")
                .set("authorization", `Bearer ${loggedInUser.body.data.token}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).equals('products returned successfully')
                })
                .end(done)
        })
    })
    describe("gets one Product", () => {
        it('should return a 401 if no token', (done) => {
            request(app)
                .get("/api/v1/product/view-active-product/2")
                .expect(401)
                .end(done)
        })

        it('should return a product when the Id is passed', (done) => {
            request(app)
                .get("/api/v1/product/view-active-product/2")
                .set("authorization", `Bearer ${loggedInUser.body.data.token}`)
                .expect(200)
                .end(done)
        })
    })

    describe("gets all Product", () => {
        it('should return product when search params is passed', (done) => {
            request(app)
                .get("/api/v1/search?q=ki")
                .expect(200)
                .end(done)
        })
    })
})