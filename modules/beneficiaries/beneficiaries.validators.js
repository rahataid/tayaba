const Joi = require("joi");
const { AbstractValidator } = require("@rumsan/core/abstract");

const validators = {
  add: {
    payload: Joi.object({
      name: Joi.string().example("john doe"),
      gender: Joi.string().valid("M", "F", "O").example("M"),
      cnicNumber: Joi.string().example("12334"),
      phone: Joi.string().example("456345"),
      walletAddress: Joi.string().required().example("0xABJWAN6666..."),
      phoneOwnedBy: Joi.string().required().example("azimsd"),
      simRegisteredUnder: Joi.string().example("azimsd"),
      phoneType: Joi.string().valid("smartphone", "featurephone", "dumphone").example("smartphone"),
      phoneOwnerRelation: Joi.string().example("azimsd"),
      unionCouncil: Joi.string().example("azimsd"),
      relationship: Joi.string().example("azimsd"),
      relativeName: Joi.string().example("azimsd"),
      hasInternetAccess: Joi.bool().required().example(false),
      bankAccount: Joi.string().example("azimsd").optional(),
      dailyDistanceCovered: Joi.string().example("azimsd"),
      dailyWaterConsumption: Joi.string().example("azimsd"),
      projectId: Joi.number().example(1),
      villageId: Joi.number().example(1),
      isBanked: Joi.bool().required().example(false),
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
      name: Joi.string().example("john doe"),
      gender: Joi.string().valid("male", "female", "others"),
      cnicNumber: Joi.string(),
      phone: Joi.string(),
      walletAddress: Joi.string().example("0xABJWAN6666..."),    
      extras: Joi.object({
        phoneOwnedBy: Joi.string(),
        simRegisteredUnder: Joi.string(),
        phoneType: Joi.string(),
        phoneOwnerRelation: Joi.string(),
        unionCouncil: Joi.string(),
        relationship: Joi.string(),
        relativeName: Joi.string(),
        hasInternetAccess: Joi.string(),
        bankAccount: Joi.string(),
        dailyDistanceCovered: Joi.string(),
        dailyWaterConsumption: Joi.string(),
      }),
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
