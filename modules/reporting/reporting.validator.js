const Joi = require("joi");
const { AbstractValidator } = require("@rumsan/core/abstract");

const validators = {
  getBeneficiaryPiechart: {
    params: Joi.object({
      type: Joi.string().required().error(new Error("Invalid type")),
    }),
  },
};

module.exports = class extends AbstractValidator {
  validators = validators;
};
