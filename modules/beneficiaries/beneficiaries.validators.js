const Joi = require("joi");
const { AbstractValidator } = require("@rumsan/core/abstract");

const validators = {
  add: {
    payload: Joi.object({
        name : Joi.string().example("john doe"),
        phone : Joi.string(),
        wallet_address : Joi.string().example('0xABJWAN6666...'),
        email : Joi.string(),
        address : Joi.string(),
        address_temporary : Joi.string(),
        gender : Joi.string(),
    }),
  },

  getById : {
    params : Joi.object({
      id : Joi.number(),
    }),
  },

  update : {
    params : Joi.object({
      id : Joi.number(),
    }),
    payload : Joi.object({
      name : Joi.string().example("john doe"),
      phone : Joi.string(),
      wallet_address : Joi.string().example('0xABJWAN6666...'),
      email : Joi.string(),
      address : Joi.string(),
      address_temporary : Joi.string(),
      gender : Joi.string(),
    })
  },

  delete : {
    params : Joi.object({
      id : Joi.number(),
    })
  }
};

module.exports = class extends AbstractValidator {
  validators = validators;
};
