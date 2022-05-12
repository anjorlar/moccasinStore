const config = require("../config/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectRedis = require("../config/redis");


const validateRequest = async (data, validationSchema) => {
	const errors = validationSchema.validate(data);

	if (errors.error) {
		return errors.error.details[0].message;
	}
};

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(Number(config.salt));
	const hash = await bcrypt.hash(password, salt);
	return hash;
};

const createToken = async (data) => {
	const token = jwt.sign(data, config.jwt.SECRETKEY, {
		subject: config.appName,
		algorithm: config.jwt.alg,
		expiresIn: config.jwt.expires,
		issuer: config.jwt.issuer,
	});
	return token;
};

const validatePassword = async (password, hashedPassword) => {
	const isMatch = await bcrypt.compare(password, hashedPassword);
	if (isMatch) {
		return true;
	}
	return false;
};

const verifyToken = async (token) => {
	try {
		const decoded = jwt.verify(token, config.jwt.SECRETKEY, {
			subject: config.appName,
			algorithms: [config.jwt.alg],
			issuer: config.jwt.issuer,
		});
		return decoded;
	} catch (error) {
		throw new Error("invalid token");
	}
};
const checkIfProductIdExistAndIncrement = (inputObj, respArray) => {
	let changed = false;
	for (let rec of respArray) {
		if (String(inputObj.productId) === String(rec.productId)) {
			rec.quantity = Number(rec.quantity) + Number(inputObj.quantity);
			changed = true
		}
	}
	return {
		respArray,
		changed
	};
}

const meta = (count, limit, page) => {
	page = Number(page)
	limit = Number(limit)
	count = Number(count)
	const previousPage = page < 2 ? null : page - 1;
	const numberOfPages = Math.ceil(count / limit);
	const nextPage = count - limit * page > 1 ? page + 1 : null;

	return {
		previousPage,
		currentPage: page,
		nextPage,
		numberOfPages,
		total: count,
	};
};

const addDataToCache = (str, data, duration = 3600) => {
	connectRedis.setex(str, duration, JSON.stringify(data));
};

const removeDataFromCache = (str) => {
	connectRedis.del(str);
};

module.exports = {
	validateRequest,
	hashPassword,
	createToken,
	validatePassword,
	verifyToken,
	checkIfProductIdExistAndIncrement,
	meta,
	addDataToCache,
	removeDataFromCache,
};
