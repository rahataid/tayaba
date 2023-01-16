const Joi = require("joi");
const { AbstractValidator } = require("@rumsan/core/abstract");

const validators = {
  add: {
    payload: Joi.object({
      name: Joi.string().example("john doe"),
      gender: Joi.string().valid("M", "F", "O").example("M"),
      cnicNumber: Joi.string().example("12334"),
      phone: Joi.string().example("456345"),
      walletAddress: Joi.string().example("0xABJWAN6666..."),
      email: Joi.string().example("test@gmail.com"),
      address: Joi.object({
        taluka: Joi.string().example("azimsd"),
        district: Joi.string().example("azimsd"),
        village: Joi.string().example("azimsd"),
      }),

      phoneOwnedBy: Joi.string().example("azimsd"),
      simRegisteredUnder: Joi.string().example("azimsd"),
      phoneType: Joi.string().example("smartphone"),
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
      email: Joi.string(),
      address: Joi.object({
        taluka: Joi.string(),
        district: Joi.string(),
        village: Joi.string(),
      }),
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
