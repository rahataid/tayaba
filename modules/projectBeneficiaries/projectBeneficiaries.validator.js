const Joi = require("joi");
const { AbstractValidator } = require("@rumsan/core/abstract");

const validators = {
  add: {
    payload: Joi.object({
      id: Joi.number().required().example(1).error(new Error("Invalid id")),
      projectId: Joi.number().required().example(1).error(new Error("Invalid id")),
      beneficiaryId: Joi.number().required().example(1).error(new Error("Invalid id")),
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
