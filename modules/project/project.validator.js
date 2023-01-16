const Joi = require("joi");
const { AbstractValidator } = require("@rumsan/core/abstract");

const validators = {
  add: {
    payload: Joi.object({
      name: Joi.string().required().error(new Error("Invalid name")),
      startDate: Joi.date().optional().error(new Error("Invalid Start Date")),
      endDate: Joi.date().optional().error(new Error("Invalid End Date")),
      owner: Joi.number(),
      budget : Joi.number().required().example(0),
      disbursed : Joi.number().required().example(0),
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
