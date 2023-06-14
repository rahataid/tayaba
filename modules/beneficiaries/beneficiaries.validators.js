const Joi = require('joi');
const { AbstractValidator } = require('@rumsan/core/abstract');

const validators = {
  add: {
    payload: Joi.object({
      name: Joi.string().example('john doe'),
      gender: Joi.string().valid('M', 'F', 'O').example('M'),
      cnicNumber: Joi.string().example('12334'),
      phone: Joi.string().example('456345'),
      walletAddress: Joi.string().required().example('0xABJWAN6666...'),
      phoneType: Joi.string()
        .valid('smartphone', 'featurephone', 'dumbphone')
        .example('smartphone'),
      phoneOwnedBy: Joi.string().required().example('SELF'),
      projectId: Joi.number().optional().example(1),
      miscData: Joi.object({}),
      villageId: Joi.number().example(1),
      community: Joi.string().example('gfhdgfh').optional(),
    }),
  },
  getById: {
    params: Joi.object({
      walletAddress: Joi.string(),
    }),
  },

  update: {
    params: Joi.object({
      walletAddress: Joi.string(),
    }),
    payload: Joi.object({
      name: Joi.string().example('john doe'),
      gender: Joi.string().valid('male', 'female', 'others'),
      cnicNumber: Joi.string(),
      phone: Joi.string(),
      walletAddress: Joi.string().example('0xABJWAN6666...'),
      villageId: Joi.number().example(1),
    }),
  },

  updateStatus: {
    params: Joi.object({
      address: Joi.string(),
    }),
    payload: Joi.object({
      isActive: Joi.boolean(),
    }),
  },

  updateUsingWalletAddress: {
    params: Joi.object({
      walletAddress: Joi.string(),
    }),
    payload: Joi.object({
      name: Joi.string(),
      phone: Joi.string(),
      bankAccount: Joi.string(),
      dailyDistanceCovered: Joi.number(),
      villageId: Joi.number(),
      gender: Joi.string(),
    }),
  },

  delete: {
    params: Joi.object({
      walletAddress: Joi.string(),
    }),
  },
};

module.exports = class extends AbstractValidator {
  validators = validators;
};
