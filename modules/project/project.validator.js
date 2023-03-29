const Joi = require('joi');
const { AbstractValidator } = require('@rumsan/core/abstract');

const validators = {
  add: {
    payload: Joi.object({
      name: Joi.string().required().example('H20 Wheels').error(new Error('Invalid name')),
      startDate: Joi.date().optional().error(new Error('Invalid Start Date')),
      endDate: Joi.date().optional().error(new Error('Invalid End Date')),
      projectManager: Joi.string().example('jdgfdgh'),
      extras: Joi.object().optional(),
      location: Joi.string().required(),
      description: Joi.string().required(),
      projectType: Joi.string().required(),
    }),
  },
  delete: {
    params: Joi.object({
      id: Joi.number().required(),
    }),
  },
  getById: {
    params: Joi.object({
      id: Joi.number().required(),
    }),
  },
  update: {
    query: Joi.object({
      id: Joi.number().optional(),
      walletAddress:Joi.string().optional()

    }),
    payload: Joi.object({
      name: Joi.string().required().example('H20 Wheels').error(new Error('Invalid name')),
      startDate: Joi.date().optional().error(new Error('Invalid Start Date')),
      endDate: Joi.date().optional().error(new Error('Invalid End Date')),
      projectManager: Joi.string().example('Jon'),
      extras: Joi.object().optional(),
      location: Joi.string().required(),
      description: Joi.string().required(),
    }),
  },
};

module.exports = class extends AbstractValidator {
  validators = validators;
};
