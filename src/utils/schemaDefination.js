const Joi = require("joi");

const CreateUserSchema = Joi.object({
	name: Joi.string().required().messages({
		"string.base": `name should be a string.`,
		"string.empty": `name is required.`,
		"any.required": `name is required.`,
	}),
	address: Joi.string().required().messages({
		"string.base": `address should be a string.`,
		"string.empty": `address is required.`,
		"any.required": `address is required.`,
	}),
	email: Joi.string().required().email().messages({
		"string.base": `email should be a string.`,
		"string.empty": `email is required.`,
		"string.email": `email should be a valid email pattern.`,
		"any.required": `email is required.`,
	}),
	password: Joi.string().required().min(5).messages({
		"string.base": `password should be a string.`,
		"string.empty": `password is required.`,
		"any.required": `password is required.`,
	}),
});

const CredentialSchema = Joi.object({
	email: Joi.string().required().email().messages({
		"string.base": `email should be a string.`,
		"string.empty": `email is required.`,
		"string.email": `email should be a valid email pattern.`,
		"any.required": `email is required.`,
	}),
	password: Joi.string().required().min(5).messages({
		"string.base": `password should be a string.`,
		"string.empty": `password is required.`,
		"any.required": `password is required.`,
	}),
});

const cartSchema = Joi.object({
	productId: Joi.number().messages({
		"number.base": `productId should be a number.`,
		"number.empty": `productId is required.`,
		"any.required": `productId is required.`,
	}),
	quantity: Joi.number().messages({
		"number.base": `quantity should be a number.`,
		"number.empty": `quantity is required.`,
		"any.required": `quantity is required.`,
	})
})


module.exports = {
	CreateUserSchema,
	CredentialSchema,
	cartSchema,
};