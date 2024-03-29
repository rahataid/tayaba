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
      phoneOwnedBy: Joi.string().required().example('azimsd'),
      simRegisteredUnder: Joi.string().example('azimsd'),
      phoneType: Joi.string()
        .valid('smartphone', 'featurephone', 'dumbphone')
        .example('smartphone'),
      phoneOwnerRelation: Joi.string().example('azimsd'),
      unionCouncil: Joi.string().example('azimsd'),
      relationship: Joi.string().example('azimsd'),
      relativeName: Joi.string().example('azimsd'),
      hasInternetAccess: Joi.bool().required().example(false),
      bankAccount: Joi.string().example('azimsd').optional(),
      bankAccountType: Joi.valid('current', 'savings').optional().example('savings'),
      dailyDistanceCovered: Joi.number().example(10),
      dailyWaterConsumption: Joi.number().example(4),
      villageId: Joi.number().example(1),
      isBanked: Joi.bool().required().example(false),
      projectId: Joi.number().example(1),
      miscData: Joi.object({}),
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
      tokensAssigned: Joi.number(),
      tokensClaimed: Joi.number(),
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
