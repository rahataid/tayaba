const Joi = require("joi");
const { AbstractValidator } = require("@rumsan/core/abstract");

const validators = {
  add: {
    payload: Joi.object({
      name: Joi.string().required().example('aligadh').error(new Error("Invalid name")),
      taluka : Joi.string().example('Faiz Ahmed'),
      district : Joi.string().example('karachi')
    }),

  },
  delete: {
    params: Joi.object({
      id: Joi.number().required(),

    }),
  },
  getById: {
    params: Joi.object({
      id: Joi.number().required(),
    }),
  },
  update: {
    params: Joi.object({
      id: Joi.number().required(),
    }),
  }
};

module.exports = class extends AbstractValidator {
  validators = validators;
};
