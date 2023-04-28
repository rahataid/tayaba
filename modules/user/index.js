const Joi = require('joi');
const { UserRouter } = require('@rumsan/user');
const { PERMISSIONS } = require('../../constants');
const Controller = require('./user.controllers');

module.exports = class extends UserRouter {
  constructor() {
    super({
      controller: new Controller(),
    });
    this.addRoutes({
      add: {
        method: 'POST',
        path: '',
        description: 'Add new user using email address.',
        permissions: [PERMISSIONS.USER_WRITE, PERMISSIONS.USER_MANAGE],
        validator: {
          payload: Joi.object({
            name: Joi.string()
              .required()
              .example('Mr. Ram Singh')
              .error(new Error('Invalid name.')),
            email: Joi.string()
              .required()
              .email()
              .example('test@test.com')
              .error(new Error('Invalid email.')),
            password: Joi.string()
              .optional()
              .example('$xample')
              .error(new Error('Invalid password.')),
            roles: Joi.array()
              .items(Joi.string())
              .optional()
              .example(['admin'])
              .error(new Error('Invalid roles.')),
          }),
        },
      },
      generateSigninMessage: {
        method: 'GET',
        path: '/walletmessage',
        description: 'get wallet message',
      },
    });
  }
};
