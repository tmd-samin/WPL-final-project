import Joi from "joi";
// joi is a validation library of Cards //
export const middlewareSales = Joi.object({
  nameAgent: Joi.string().min(3).max(100).allow(""),
  sellerFiber: Joi.number().required().min(0).max(15).messages({
    "number.base": "The amount of Fiber sales must be stated even if it is - 0",
  }),
  sellerTV: Joi.number().required().min(0).max(15).messages({
    "number.base": "The amount of TV sales must be stated even if it is - 0",
  }),
  easyMesh: Joi.number().required().min(0).max(15).messages({
    "number.base": "The amount of EasyMesh sales must be specified even if it is - 0",
  }),
  upgradeProgress: Joi.number().required().min(0).max(15).messages({
    "number.base": "Upgrade sales amount must be specified even if it is - 0",
  }),
  customerCode: Joi.string()
    .pattern(/^\d{9}$/)
    .required()
    .messages({
      "string.empty": "Required customer code",
      "string.pattern.base": "Customer code must be a number with a length of 9 characters",
    }),
  targets: Joi.number()
    .min(0)
    .max(100)
    .message("The number of targets must be between 1-2 digits")
    .allow(""),
  teamName: Joi.string()
    .pattern(/iron|impact|toy/)
    .message("The team name must include 'iron' or 'impact' or 'toy'")
    .allow(""),
  userId: Joi.string().allow(""),
  user_id: Joi.string().allow(""),
});

export const middlewareBiz = Joi.object({
  newBizNumber: Joi.number().min(100000000).max(999999999),
});
