const Joi = require("joi");
const { AbstractValidator } = require("@rumsan/core/abstract");

const validators = {
  getContracts: {
    params: Joi.object({
      contract: Joi.string(),
    }),
  },
};

module.exports = class extends AbstractValidator {
  validators = validators;
};
