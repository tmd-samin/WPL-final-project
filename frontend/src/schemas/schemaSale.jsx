import Joi from "joi";

const customMessages = {
  'value.invalid': 'You need at least one sale',
};
export const schemaSales = Joi.object({
  nameAgent: Joi.string().required().min(3).max(100).allow(""),
sellerFiber: Joi.number()
  .required()
  .min(0)
  .max(15)
  .messages({
    'number.base': 'The number of Fiber sales must be specified even if it is 0',
  }),
sellerTV: Joi.number()
  .required()
  .min(0)
  .max(15)
  .messages({
    'number.base': 'The number of TV sales must be specified even if it is 0',
  }),
  easyMesh: Joi.number()
    .required()
    .min(0)
    .max(15)
      .messages({
    'number.base': 'The number of EasyMesh sales must be specified even if it is 0',
  }),
  upgradeProgress: Joi.number()
    .required()
    .min(0)
    .max(15)
  .messages({
    'number.base': 'The number of upgrade sales must be specified even if it is 0',
  }),
customerCode: Joi.string().pattern(/^\d{9}$/).required().messages({
    "string.empty": "Customer code is mandatory",
    "string.pattern.base": "Customer code must be a number with a length of 9 characters",
}),
  targets: Joi.number()
    .min(0)
    .max(100)
    .message("The number of targets must be between 1 and 2 digits")
    .allow(""),
  teamName: Joi.string()
    .required()
    .pattern(/iron|impact|toy/)
    .message("The team name must include 'iron' or 'impact' or 'toy'")
    .allow(""),
  userId: Joi.string().allow(""),
  user_id: Joi.string().allow(""),
}).custom((value, helpers) => {
  if (value.sellerFiber >= 1 || value.sellerTV >= 1 || value.easyMesh >= 1 || value.upgradeProgress >= 1) {
    return value;
  } else {
    return helpers.error('value.invalid');
  }
}).messages(customMessages);

export const middlewareBiz = Joi.object({
  newBizNumber: Joi.number().min(100000000).max(999999999),
});

