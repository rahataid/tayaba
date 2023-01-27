const Joi = require('joi');
const { AbstractValidator } = require('@rumsan/core/abstract');

const validators = {
  getBeneficiaryPiechartByProject: {
    params: Joi.object({
      type: Joi.string().required().error(new Error('Invalid type')),
    }),
    query: Joi.object({
      projectId: Joi.number().optional().error(new Error('Invalid project id')),
      village: Joi.string().optional().error(new Error('Invalid Village')),
    }),
  },
};

module.exports = class extends AbstractValidator {
  validators = validators;
};
