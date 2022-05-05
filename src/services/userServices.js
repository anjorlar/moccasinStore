const models = require("../models");

const UserService = {

	async createUser(data) {
		return models.users.create(data);
	},

	async findUserByEmail(email) {
		return models.users.findOne({
			where: {
				email,
			},
		});
	},

	async findUserById(id) {
		return models.users.findByPk(id);
	}
}

module.exports = UserService;
