import Joi from "joi";
// joi is a validation library of User //
export const middlewareUsers = Joi.object({
  name: Joi.object({
    first: Joi.string().min(2).required().messages({
      "string.empty": "First name is required",
      "string.min": "First name must be at least two characters"    
    }),
    middle: Joi.string().allow("").optional(),
    last: Joi.string().min(2).required().messages({
      "string.empty": "Last name is required",
      "string.min": "Last name must be at least two characters"    
    }),
  }),
  email: Joi.string().email({ tlds: false }).required().messages({
    "string.empty": "Email address is required",
    "string.email": "Invalid email address",    
  }),
  IsBusiness: Joi.boolean().allow(""),
  phone: Joi.string()
    .max(10)
    .pattern(/^0(5[^7]|[2-4]|[8-9]|7[0-9])[0-9]{7}$/)
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base": "The mobile number must be 10 digits and contain only numbers",
      "string.max": "The phone number must not exceed 10 digits",
    
    }),
  isAdmin: Joi.boolean().optional(),
  password: Joi.string()
    .min(8)
    .max(32)
    .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@%$#^&*\-_*]).{8,32}$/)
    .allow("")
    .optional()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must not exceed 32 characters",
      "string.pattern.base": "Password must contain at least one uppercase letter and one special character"
    }),
  teamName: Joi.string().valid("iron", "impact", "toy").required().messages({
    "any.only": "Team name must be one of the following options: iron, impact, toy",
    "string.empty": "Team name is required",
  }),
  serviceDepartment: Joi.boolean().allow(""),
  conservationDepartment: Joi.boolean().allow(""),
  userId: Joi.string().allow(""),
});
