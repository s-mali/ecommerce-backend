const joi = require("joi");

const productSchema = joi.object({
	prodyctName: joi.string().required(),
	brand: joi.string().required(),
	category: joi.string().required(),
	price: joi.string().replace(),
	discription: joi.string().required(),
    inStock: joi.number().required()
});

exports.productValidation = async (req, res, next) => {
	const payload = {
		productName: req.body.productName,
		brand: req.body.brand,
		category: req.body.category,
		price: req.body.price,
		inStock: req.body.inStock,
        discription: req.body.discription
	};

	const { error } = productSchema.validate(payload);
	if (error) {
		res.status(406);
		return res.json(`Error in  Data : ${error.message}`)

	} else {
		next();
	}
};