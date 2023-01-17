const Joi = require("joi");
const { AbstractValidator } = require("@rumsan/core/abstract");

const validators = {
  // add: {
  //   payload: Joi.object({
  //     name: Joi.number().required().example("test user!"),
  //     // phone: Joi.number().required().example("9800818412"),
  //     // id: Joi.number().example(11),
  //     // txHash: Joi.string().example(
  //     //   "0x55542c184686fabbf5768dbafa1ee0235ddef6af7d224e0c8513cb44ebfb4568"
  //     // ),
  //     // amount: Joi.number().example(1000),
  //     // beneficiary: Joi.string().example("9800818412"),
  //     // ward: Joi.string().example(1),
  //     // method: Joi.string().required().example("sms"),
  //     // mode: Joi.string().required().example("online"),
  //   }),
  // },
};

module.exports = class extends AbstractValidator {
  validators = validators;
};
