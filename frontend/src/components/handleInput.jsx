import { schemaOperations } from "../schemas/schemaOperation";
import { schemaSales } from "../schemas/schemaSale";

// handleInput is for creating a new item
export const handleInput = (
  e,
  formData,
  setFormData,
  errors,
  setErrors,
  setIsFormValid
) => {
  const { id, value } = e.target;
  const numberKeys = ["numberCalls", "tvDisconnection", "fiberDisconnection"];
  const newValue = numberKeys.includes(id) ? Number(value) : value;
  const obj = { ...formData, [id]: newValue };
  setFormData(obj);

  const validate = schemaOperations.validate(obj, { abortEarly: false });
  const tempErrors = { ...errors };
  delete tempErrors[id];

  if (validate.error) {
    const item = validate.error.details.find((e) => e.context.key === id);

    if (item) {
      tempErrors[id] = item.message;
    }
  }
  setIsFormValid(!validate.error);
  setErrors(tempErrors);
};
// handleInputEdit is for editing an existing item
export const handleInputEdit = (
  e,
  item,
  setItem,
  errors,
  setErrors,
  setIsFormValid
) => {
  const { id, value } = e.target;
  const numberKeys = ["numberCalls", "tvDisconnection", "fiberDisconnection"];
  const newValue = numberKeys.includes(id) ? Number(value) : value;
  const obj = { ...item, [id]: newValue };
  setItem(obj);

  const validate = schemaOperations.validate(obj, { abortEarly: false });
  const tempErrors = { ...errors };
  delete tempErrors[id];

  if (validate.error) {
    const item = validate.error.details.find((e) => e.context.key === id);

    if (item) {
      tempErrors[id] = item.message;
    }
  }
  setIsFormValid(!validate.error);
  setErrors(tempErrors);
};

// handleInput to create a new seller

export const handleInputSale = (
  e,
  saleData,
  setSaleData,
  errors,
  setErrors,
  setIsFormValid
) => {
  const { id, value } = e.target;
  const obj = { ...saleData, [id]: value };
  setSaleData(obj);

  const validate = schemaSales.validate(obj, { abortEarly: false });
  const tempErrors = { ...errors };
  delete tempErrors[id];

  if (validate.error) {
    const item = validate.error.details.find((e) => e.context.key === id);

    if (item) {
      tempErrors[id] = item.message;
    }
  }
  setIsFormValid(!validate.error);
  setErrors(tempErrors);
};

export const handleInputSaleEdit = (
  e,
  saleDataUpDate,
  setSaleDataUpDate,
  errors,
  setErrors,
  setIsFormValid
) => {
  const { id, value } = e.target;
  const obj = { ...saleDataUpDate, [id]: value };
  setSaleDataUpDate(obj);

  const validate = schemaSales.validate(obj, { abortEarly: false });
  const tempErrors = { ...errors };
  delete tempErrors[id];

  if (validate.error) {
    const item = validate.error.details.find((e) => e.context.key === id);

    if (item) {
      tempErrors[id] = item.message;
    }
  }
  setIsFormValid(!validate.error);
  setErrors(tempErrors);
};
