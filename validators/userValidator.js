const joi = require("joi");

const signUpSchema = joi.object({
	firstName: joi.string().alphanum().min(3).max(25).trim(true).required(),
	lastName: joi.string().alphanum().min(3).max(25).trim(true).required(),
	email: joi.string().email().trim(true).required(),
	role: joi.string().default('user'),
	password: joi.string().min(6).trim(true).required(),
});

const loginSchema = joi.object({
	email: joi.string().email().trim(true).required(),
	password: joi.string().min(6).trim(true).required(),
});


exports.signUpValidation = async (req, res, next) => {
	const payload = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		role: req.body.role,
		password: req.body.password,
	};

	const { error } = signUpSchema.validate(payload);
	if (error) {
		res.status(406);
		return res.json(`Error in  Data : ${error.message}`)

	} else {
		next();
	}
};

exports.loginValidation = async (req, res, next) => {

	if (req.body.email_verified) {
		next()
	}
	else {
		const payload = {

			email: req.body.email,
			password: req.body.password,
		};

		const { error } = loginSchema.validate(payload);
		if (error) {
			res.status(406);
			return res.json(`Error in  Data : ${error.message}`)

		} else {
			next();
		}

	}
};

