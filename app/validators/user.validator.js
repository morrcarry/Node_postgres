const Joi = require('joi');

function validateUser(object) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(12).required(),
  });
  return schema.validate(object);
}

function validateLogin(object) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    privateKey: Joi.string().required(),
  });
  return schema.validate(object);
}

function validateAdmin(object) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(12).required(),
    company_id: Joi.number().required(),
  });
  return schema.validate(object);
}

function validateCompany(object) {
  const schema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
  });
  return schema.validate(object);
}

module.exports = {
  validateUser, validateLogin, validateAdmin, validateCompany,
};
