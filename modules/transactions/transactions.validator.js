const Joi = require('joi');
const { AbstractValidator } = require('@rumsan/core/abstract');

const validators = {
  add: {
    payload: Joi.object({
      txHash: Joi.string().example('0xHGAGSDJH54554..'),
      contractAddress: Joi.string().example('0xRJUHJFGSDJH54554..'),
      timestamp: Joi.number(),
      beneficiaryId: Joi.number().required().example(1),
      vendorId: Joi.number().required().example(1),
      projectId: Joi.number().required().example(1),
      amount: Joi.number().required().example(1),
      isOffline: Joi.boolean().required().example(false),
      txType: Joi.string().valid('sms', 'qr', 'wallet'),
      event: Joi.string().example('Beneficiary Claim'),
    }),
  },
};

module.exports = class extends AbstractValidator {
  validators = validators;
};
