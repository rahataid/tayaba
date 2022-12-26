const Joi = require("joi");
const { AbstractValidator } = require("@rumsan/core/abstract");

const validators = {
  add: {
    payload: Joi.object({
      name: Joi.string().required().error(new Error("Invalid name")),
    }),

  },
  delete:{
    params:Joi.object({
      id: Joi.string().required().error(new Error("Id is required")),
      id: Joi.string().guid({ version : 'uuidv4' }).error(new Error("Invalid Id")),

    }),
  },
  update:{
    params:Joi.object({
      id: Joi.string().required().error(new Error("Id is required")),
    }),
  }
};

module.exports = class extends AbstractValidator {
  validators = validators;
};
