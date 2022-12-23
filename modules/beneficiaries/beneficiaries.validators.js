const Joi = require("joi");
const { AbstractValidator } = require("@rumsan/core/abstract");

const validators = {
  add: {
    payload: Joi.object({
        name : Joi.string().example("john doe"),
        gender : Joi.string().valid('male', 'female', 'others'),
        cnicNumber : Joi.string(),
        phone : Joi.string(),
        walletAddress : Joi.string().example('0xABJWAN6666...'),
        email : Joi.string(),
        address : Joi.object({
          taluka : Joi.string(),
          district : Joi.string(),
          village : Joi.string(),
        }),
        extras : Joi.object({
          phoneOwnedBy :  Joi.string(),  
          simRegisteredUnder : Joi.string(),  
          phoneType : Joi.string(),  
          phoneOwnerRelation : Joi.string(),  
          unionCouncil : Joi.string(),  
          relationship : Joi.string(),  
          relativeName : Joi.string(), 
          hasInternetAccess : Joi.string(),  
          bankAccount : Joi.string(),  
          dailyDistanceCovered : Joi.string(),
          dailyWaterConsumption : Joi.string(),
        })
        
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
    payload: Joi.object({
      name : Joi.string().example("john doe"),
      gender : Joi.string().valid('male', 'female', 'others'),
      cnicNumber : Joi.string(),
      phone : Joi.string(),
      walletAddress : Joi.string().example('0xABJWAN6666...'),
      email : Joi.string(),
      address : Joi.object({
        taluka : Joi.string(),
        district : Joi.string(),
        village : Joi.string(),
      }),
      extras : Joi.object({
        phoneOwnedBy :  Joi.string(),  
        simRegisteredUnder : Joi.string(),  
        phoneType : Joi.string(),  
        phoneOwnerRelation : Joi.string(),  
        unionCouncil : Joi.string(),  
        relationship : Joi.string(),  
        relativeName : Joi.string(), 
        hasInternetAccess : Joi.string(),  
        bankAccount : Joi.string(),  
        dailyDistanceCovered : Joi.string(),  
        dailyWaterConsumption : Joi.string(),
      })
      
  }),
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
