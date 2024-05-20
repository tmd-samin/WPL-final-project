import Joi from "joi";

export const schemaOperations = Joi.object({
  nameAgent: Joi.string().min(3).required().messages({
    "string.empty": "Agent name is required",
    "string.min": "Agent name must be between 3 and 30 characters",
  }),
  numberCalls: Joi.number().min(1).max(100).required().messages({
    "number.empty": "Number of calls is required",
    "number.min": "Number of calls must be between 1 and 2 digits",
  }),
  productivity: Joi.string().pattern(/^\d+\.\d{2}$/).required().messages({
    "string.empty": "Productivity is required",
    "string.pattern.base": "Productivity must be a decimal number with two digits after the point (e.g., 4.22)",
  }),
  simurTV: Joi.string().min(3).required().messages({
    "string.empty": "TV retention is required",
    "string.min": "TV retention must be between 1 and 3 digits",
  }),
  simurFiber: Joi.string().min(3).required().messages({
    "string.empty": "Fiber retention is required",
    "string.min": "Fiber retention must be between 1 and 3 digits",
  }),
  tvDisconnection: Joi.number().min(0).max(100).required().messages({
    "number.base": "TV disconnections must be at least a digit even if it's 0",
    "number.empty": "Number of TV disconnections is required",
    "number.min": "TV disconnections must be at least a digit even if it's 0",
  }),
  fiberDisconnection: Joi.number().min(0).max(100).required().messages({
    "number.base": "Fiber disconnections must be at least a digit even if it's 0",
    "number.empty": "Number of fiber disconnections is required",
    "number.min": "Fiber disconnections must be at least a digit even if it's 0",
  }),
  satisfaction: Joi.string().pattern(/^100%$|^[1-9][0-9]?%$|^[0-9]%$/).required().messages({
    "string.empty": "Customer satisfaction is required",
    "string.pattern.base": "Customer satisfaction must be between 0% and 100%",
  }),
  teamName: Joi.string().valid("iron", "impact", "toy").required().messages({
    "any.only": "Team name must be one of the following: iron, impact, toy",
    "string.empty": "Team name is required",
  }),
  simurFiberColor: Joi.string().allow(""),
  simurTVColor: Joi.string().allow(""),
});
