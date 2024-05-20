import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import { useContext, useState } from "react";
import { GeneralContext } from "../App";
import Switch from "@mui/material/Switch";
import { FormControlLabel } from "@mui/material";
import clientStructure from "./ClientStructure";
import { useNavigate } from "react-router-dom";
import schema from "./TextFieldAndJoi";

export default function Account({ theme }) {
  const { user, setUser, setLoader } = useContext(GeneralContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: {
      first: user?.name?.first || "",
      middle: user?.name?.middle || "",
      last: user?.name?.last || "",
    },
    IsBusiness: user?.IsBusiness || false,
    serviceDepartment: user?.serviceDepartment || false,
    conservationDepartment: user?.conservationDepartment || true,
    teamName: user?.teamName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    password: user?.password || "",
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const handelChange = (ev) => {
    const { name, value } = ev.target;
    let obj = { ...formData };

    if (name === "phone") {
      obj[name] = value.replace(/\D/g, "");
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
      obj[parent] = { ...obj[parent], [child]: value };
    } else {
      obj = { ...obj, [name]: value };
    }

    setFormData(obj);

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
    setUser({ ...user, [name]: ev.target.value });
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

  setLoader(true);

  fetch(`http://localhost:4000/api/user/${user._id}`, {
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
        navigate("/account");
      } else {
        throw new Error(data);
      }
    })
    .catch((err) => alert(err.message))
    .finally(() => setLoader(false));
};

  return (
    <>
      {
        <ThemeProvider theme={theme}>
          {user ? (
            <Container component="main" maxWidth="xs">
              <Box
                sx={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}>
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  {`Your user details: ${user?.name?.first}`}{" "}
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}>
                  <Grid container spacing={2}>
                    {clientStructure.map((s) => {
                      if (s.fields) {
                        return s.fields.map((field) => (
                          <Grid
                            key={field.name}
                            item
                            xs={12}
                            sm={field.block ? 12 : 6}>
                            {field.type === "boolean" ? (
                              <FormControlLabel
                                control={
                                  <Switch
                                    color="primary"
                                    name={`${s.name}.${field.name}`}
                                    checked={user[s.name] || false}
                                    style={{
                                      backgroundColor:
                                        "rgba(78, 210, 193, 255)",
                                    }}
                                  />
                                }
                                label={field.label}
                                labelPlacement="start"
                              />
                            ) : (
                              <TextField
                                size="small"
                                error={!!errors[`${s.name}.${field.name}`]}
                                helperText={errors[`${s.name}.${field.name}`]}
                                margin="normal"
                                required={field.required}
                                fullWidth
                                id={`${s.name}.${field.name}`}
                                label={field.label}
                                name={`${s.name}.${field.name}`}
                                value={
                                  user[s.name] && user[s.name][field.name]
                                    ? user[s.name][field.name]
                                    : ""
                                }
                                type={field.type}
                                autoComplete={`${s.name}.${field.name}`}
                                onChange={(ev) => {
                                  handelChange(ev);
                                  setUser({
                                    ...user,
                                    [s.name]: {
                                      ...(user[s.name] || {}),
                                      [field.name]: ev.target.value,
                                    },
                                  });
                                }}
                                disabled={
                                  !user.isAdmin &&
                                  ["first", "last", "middle", "email"].includes(
                                    field.name
                                  )
                                }
                              />
                            )}
                          </Grid>
                        ));
                      } else {
                        return (
                          <Grid key={s.name} item xs={12} sm={s.block ? 12 : 6}>
                            {s.type === "boolean" ? (
                              <FormControlLabel
                                control={
                                  <Switch
                                    color="primary"
                                    checked={user[s.name] || false}
                                    name={s.name}
                                    disabled={!user.isAdmin}
                                    onChange={(ev) =>
                                      setUser({
                                        ...user,
                                        [s.name]: ev.target.checked,
                                      })
                                    }
                                  />
                                }
                                label={s.label}
                                labelPlacement="start"
                              />
                            ) : (
                              <TextField
                                size="small"
                                error={!!errors[`${s.name}`]}
                                helperText={errors[`${s.name}`]}
                                margin="normal"
                                required={s.required}
                                fullWidth
                                id={s.name}
                                label={s.label}
                                type={s.type}
                                name={s.name}
                                value={user[s.name] ? user[s.name] : ""}
                                autoComplete={s.name}
                                onChange={(e) => {
                                  handelChange(e);
                                  setUser({
                                    ...user,
                                    [s.name]: e.target.value,
                                  });
                                }}
                                style={{
                                  display:
                                    s.name === "password" ? "none" : "block",
                                }}
                                disabled={
                                  !user.isAdmin &&
                                  [
                                    "first",
                                    "last",
                                    "middle",
                                    "email",
                                    "phone",
                                    "teamName",
                                  ].includes(s.name)
                                }
                              />
                            )}
                          </Grid>
                        );
                      }
                    })}
                  </Grid>
                  <Button
                    type="submit"
                    disabled={!user.isAdmin}
                    fullWidth
                    variant="contained"
                    style={{
                      backgroundColor: isFormValid ? "#4ed2c1" : "#4ed2c180",
                    }}
                    sx={{ mt: 3, mb: 2 }}>
                    Update details
                  </Button>
                </Box>
              </Box>
            </Container>
          ) : (
            <Typography variant="h5" align="center">
              You must log in to view this page
            </Typography>
          )}
          <br /> <br /> <br /> <br />
        </ThemeProvider>
      }
    </>
  );
}
