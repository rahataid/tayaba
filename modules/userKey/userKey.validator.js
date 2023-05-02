const Joi = require('joi');
const { AbstractValidator } = require('@rumsan/core/abstract');

const validators = {
  add: {
    payload: Joi.object({
      privateKey: Joi.string().required().error(new Error('Private Key Is required')),
      userId: Joi.number().required().error(new Error('UserId Is required')),
    }),
  },
};

module.exports = class extends AbstractValidator {
  validators = validators;
};
