const hooks = require('./mailer.hooks');
const Mailer = require('feathers-mailer');
const smtpTransport = require('nodemailer-smtp-transport');

module.exports = function (app) {
  app.use('/mailer', Mailer(smtpTransport({
    host: 'smtp.gmail.com',
    secure: true,
    auth: {
      user: "signup.valorantify@gmail.com",
      pass: "valorantify123"
    }
  })));
  
  const service = app.service('mailer');
  service.hooks(hooks);
};