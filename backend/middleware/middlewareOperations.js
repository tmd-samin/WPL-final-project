import Joi from "joi";
// joi is a validation library of Cards //
export const middlewareOperations = Joi.object({
  nameAgent: Joi.string().required().min(3).max(100),
  numberCalls: Joi.number().min(1).max(100).required().messages({
    "number.empty": "Number of calls is required",
    "number.min": "Number of calls must be between 1 and 2 digits"
  }),
  productivity: Joi.string()
    .pattern(/^\d+\.\d{2}$/)
    .required()
    .messages({
      "string.empty": "fertility is required",
      "string.pattern.base":
      "Prion must be a decimal number with two digits after the point (for example, 4.22)",
    }),
  tvDisconnection: Joi.number().min(0).max(100).required().messages({
    "number.base":
    "The amount of TV disconnections must be at least a digit even if it is - 0",
    "number.empty": "Amount of TV disconnections required",
    "number.min": "The amount of TV disconnections must be at least a digit even if it is - 0",
  }),
  fiberDisconnection: Joi.number().min(0).max(100).required().messages({
    "number.base": "The number of fiber disconnections must be at least one, even if it's 0",
    "number.empty": "Number of fiber disconnections is required",
    "number.min": "The number of fiber disconnections must be at least one, even if it's 0",
  }),
  simurFiber: Joi.string()
    .min(1)
    .max(10)
    .message("Fiber retention percentage must be between 1-2 digits")
    .allow(""),
  simurTV: Joi.string()
    .min(1)
    .max(10)
    .message("TV retention percentage must be between 1-2 digits")
    .allow(""),
  satisfaction: Joi.string()
    .pattern(/^100%$|^[1-9][0-9]?%$|^[0-9]%$/)
    .required()
    .messages({
      "string.empty": "Sgt. required",
      "string.pattern.base": "Smt must be between 0% and 100%",
    }),
  targets: Joi.number()
    .min(1)
    .max(3)
    .message("The number of targets must be between 1-2 digits")
    .allow(""),
  teamName: Joi.string()
    .required()
    .pattern(/iron|impact|toy/)
    .message("The team name must include 'iron' or 'impact' or 'toy'"),
  simurFiberColor: Joi.string().allow(""),
  simurTVColor: Joi.string().allow(""),
  userId: Joi.string().allow(""),
  user_id: Joi.string().allow(""),
});

export const middlewareBiz = Joi.object({
  newBizNumber: Joi.number().min(100000000).max(999999999),
});
