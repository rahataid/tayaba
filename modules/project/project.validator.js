const Joi = require("joi");
const { AbstractValidator } = require("@rumsan/core/abstract");

const validators = {
  add: {
    payload: Joi.object({
      name: Joi.string().required().error(new Error("Invalid name")),
      startDate:Joi.date().optional().error(new Error("Invalid Start Date")),
      endDate:Joi.date().optional().error(new Error("Invalid End Date")),
      projectManager: Joi.string().optional().error(new Error("Invalid Project manager Name")),
      location: Joi.string().optional().error(new Error("Invalid location")),
    }),

  },
  delete:{
    params:Joi.object({
      id: Joi.string().required().guid({ version : 'uuidv4' }).error(new Error("Id is invalid")),

    }),
  },
  update:{
    params:Joi.object({
      id: Joi.string().required().guid({ version : 'uuidv4' }).error(new Error("Id is Invalid")),
    }),
  }
};

module.exports = class extends AbstractValidator {
  validators = validators;
};
