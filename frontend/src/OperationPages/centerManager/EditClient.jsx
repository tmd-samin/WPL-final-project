import { useState } from "react";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { useMemo } from "react";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { EditPropClients } from "./EditPropClients";
import schema from "../../userIntegrated/TextFieldAndJoi";
import clientStructure from "../../userIntegrated/ClientStructure";

EditClient.propTypes = {
  dataClient: PropTypes.shape({
    name: PropTypes.shape({
      first: PropTypes.string.isRequired,
      middle: PropTypes.string,
      last: PropTypes.string.isRequired,
    }).isRequired,
    IsBusiness: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    serviceDepartment: PropTypes.bool.isRequired,
    conservationDepartment: PropTypes.bool.isRequired,
    teamName: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
  theIDclient: PropTypes.string.isRequired,
};

export default function EditClient({ dataClient, theIDclient }) {
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const initialValues = useMemo(
    () => ({
      name: {
        first: dataClient.name.first,
        middle: dataClient.name.middle,
        last: dataClient.name.last,
      },
      IsBusiness: dataClient.IsBusiness,
      isAdmin: dataClient.isAdmin,
      serviceDepartment: dataClient.serviceDepartment,
      conservationDepartment: dataClient.conservationDepartment,
      teamName: dataClient.teamName,
      phone: dataClient.phone,
      email: dataClient.email,
    }),
    [dataClient]
  );

  const [agentDataUpDate, setAgentDataUpDate] = useState(initialValues);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handelChange = (ev) => {
    const { name, value } = ev.target;
    let obj = { ...agentDataUpDate };

    if (name === "phone") {
      obj[name] = value.replace(/\D/g, "");
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
      obj[parent] = { ...obj[parent], [child]: value };
    } else {
      obj = { ...obj, [name]: value };
    }

    setAgentDataUpDate(obj);

    const validate = schema.validate(obj, { abortEarly: false });
    const tempErrors = { ...errors };
    delete tempErrors[name];

    if (validate.error) {
      let item;
      if (name.includes(".")) {
        item = validate.error.details.find(
          (e) => e.context.key === name.split(".")[1]
        );
      } else {
        item = validate.error.details.find((e) => e.context.key === name);
      }

      if (item) {
        tempErrors[name] = item.message;
      }
    }
    setIsFormValid(!validate.error);
    setErrors(tempErrors);
  };

const handleSubmit = (ev) => {
  ev.preventDefault();
  const obj = {};
  const elements = ev.target.elements;
  

  clientStructure.forEach((s) => {
    if (s.fields) {
      const nestedObj = {};
      s.fields.forEach((field) => {
        if (field.type === "boolean") {
          nestedObj[field.name] = elements[`${s.name}.${field.name}`].checked;
        } else {
          nestedObj[field.name] = elements[`${s.name}.${field.name}`].value;
        }
      });
      obj[s.name] = nestedObj;
    } else {
      if (s.type === "boolean") {
        obj[s.name] = elements[s.name].checked;
      } else {
        obj[s.name] = elements[s.name].value;
      }
    }
  });
  fetch(`http://localhost:4000/api/user/${theIDclient}`, {
    credentials: "include",
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(obj),
  })
    .then((response) => {
      if (response.status === 409) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "There is an account with an email address!",
        }));
        throw new Error("There is an account with an email address!");
      }
      return response.text();
    })
    .then((text) => {
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    })
    .then((data) => {
      if (typeof data === "object") {
        window.location.reload();
      } else {
        throw new Error(data);
      }
    })
    .catch((err) => alert(err.message))
    .finally(() => window.location.reload());
};

  return (
    <Box>
      <IconButton
        id="btnCreateAndPress"
        style={{ width: "auto" }}
        onClick={handleOpen}>
        <EditIcon />
      </IconButton>
      <EditPropClients
        open={open}
        handleClose={handleClose}
        agentDataUpDate={agentDataUpDate}
        setAgentDataUpDate={setAgentDataUpDate}
        errors={errors}
        handelChange={handelChange}
        handleSubmit={handleSubmit}
        isFormValid={isFormValid}
      />
    </Box>
  );
}
