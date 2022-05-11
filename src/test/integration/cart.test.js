const { expect } = require('chai');
const request = require("supertest");
const { app } = require("./../../app");
const { loginUser } = require("../helpers/helper");

describe("Cart", () => {
    let loggedInUser
    beforeEach(async function () {
        loggedInUser = await loginUser('gracejohn@gmail.com', 'graceeee1');
        console.error('>>>>> loggedInUser', loggedInUser.body.data.token);

    });
    describe("create a cart", () => {
        it('should return a 401 if no token', (done) => {
            request(app)
                .post("/api/v1/cart/create-cart")
                .expect(401)
                .end(done)
        })
        it("should return 400 if the required params isn't passed", (done) => {
            request(app)
                .post("/api/v1/cart/create-cart")
                .set("authorization", `Bearer ${loggedInUser.body.data.token}`)
                .send({})
                .expect(400)
                .end(done)
        })
        it("should return 400 if the correct type of value isn't passed", (done) => {
            request(app)
                .post("/api/v1/cart/create-cart")
                .set("authorization", `Bearer ${loggedInUser.body.data.token}`)
                .send({
                    products: {
                        productId: 2,
                        quantity: 1
                    }
                })
                .expect(400)
                .end(done)
        })
        it('should create a cart', (done) => {
            request(app)
                .post("/api/v1/cart/create-cart")
                .set("authorization", `Bearer ${loggedInUser.body.data.token}`)
                .send({
                    products: [
                        {
                            productId: 2,
                            quantity: 1
                        },
                        {
                            productId: 3,
                            quantity: 1
                        }
                    ]
                })
                .expect(201)
                .end(done)
        })
    })


    describe("update cart", () => {
        it('should return a 401 if no token', (done) => {
            request(app)
                .patch("/api/v1/cart/update-cart")
                .expect(401)
                .end(done)
        })
        it("should return a 400 if the required params isn't passed", (done) => {
            request(app)
                .patch("/api/v1/cart/update-cart")
                .set("authorization", `Bearer ${loggedInUser.body.data.token}`)
                .send({})
                .expect(400)
                .end(done)
        })
        it('should update cart', (done) => {
            request(app)
                .patch("/api/v1/cart/update-cart")
                .set("authorization", `Bearer ${loggedInUser.body.data.token}`)
                .send({
                    products: [
                        {
                            productId: 2,
                            quantity: 1
                        },
                        {
                            productId: 3,
                            quantity: 1
                        }
                    ]
                })
                .expect(200)
                .end(done)
        })
    })


    describe("delete cart", () => {
        it('should return a 401 if no token', (done) => {
            request(app)
                .delete("/api/v1/cart/clear-cart")
                .expect(401)
                .end(done)
        })
        it('should delete cart', (done) => {
            request(app)
                .delete("/api/v1/cart/clear-cart")
                .set("authorization", `Bearer ${loggedInUser.body.data.token}`)
                .expect(200)
                .end(done)
        })
    })


    describe("checkout", () => {
        it('should return a 401 if no token', (done) => {
            request(app)
                .post("/api/v1/cart/checkout")
                .expect(401)
                .end(done)
        })
        it("should return a 400 if the required params isn't passed", (done) => {
            request(app)
                .post("/api/v1/cart/checkout")
                .set("authorization", `Bearer ${loggedInUser.body.data.token}`)
                .send({})
                .expect(400)
                .end(done)
        })

        it("should checkout an order", (done) => {
            request(app)
                .post("/api/v1/cart/checkout")
                .set("authorization", `Bearer ${loggedInUser.body.data.token}`)
                .send({
                    address: "omole esate"
                })
                .expect(200)
                .end(done)
        })
    })

    describe("get a logged in users cart", () => {
        it('should return a 401 if no token', (done) => {
            request(app)
                .get("/api/v1/cart/individual-users-cart")
                .expect(401)
                .end(done)
        })

        it('should a cart', (done) => {
            request(app)
                .get("/api/v1/cart/individual-users-cart")
                .set("authorization", `Bearer ${loggedInUser.body.data.token}`)
                .expect(200)
                .end(done)
        })
    })
})