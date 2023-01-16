const Joi = require("joi");
const { AbstractValidator } = require("@rumsan/core/abstract");

const validators = {
  add: {
    payload: Joi.object({
      name: Joi.string().example("john doe"),
      gender: Joi.string().valid("M", "F", "O").example("M"),
      phone: Joi.number().example(456345),
      walletAddress: Joi.string().example("0xABJWAN6666..."),
      contractAddress: Joi.string().example("0xDBJWAN6667..."),
      villageId: Joi.number().example(1),
      
    }),
  },

  getById: {
    params: Joi.object({
      id: Joi.number(),
    }),
  },

  update: {
    params: Joi.object({
      id: Joi.number(),
    }),
    payload: Joi.object({
        name: Joi.string().example("john doe"),
        gender: Joi.string().valid("M", "F", "O").example("M"),
        phone: Joi.number().example(456345),
        walletAddress: Joi.string().example("0xABJWAN6666..."),
        contractAddress: Joi.string().example("0xDBJWAN6667..."),
        villageId: Joi.number().example(1),
    }),
  },

  delete: {
    params: Joi.object({
      id: Joi.number(),
    }),
  },
};

module.exports = class extends AbstractValidator {
  validators = validators;
};
