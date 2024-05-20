import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { GeneralContext } from "../App";
import Switch from "@mui/material/Switch";
import { FormControlLabel } from "@mui/material";
import schema from "./TextFieldAndJoi";
import clientStructure from "./ClientStructure.jsx";

export default function SignUp(theme) {
  const navigate = useNavigate();
  const { setLoader } = useContext(GeneralContext);

  const [formData, setFormData] = useState({
    name: {
      first: "",
      middle: "",
      last: "",
    },
    IsBusiness: false,
    serviceDepartment: false,
    conservationDepartment: true,
    teamName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const handelChange = (ev) => {
    const { name, value } = ev.target;
    let obj = { ...formData };

    if (name === "phone") {
      obj[name] = value.replace(/\D/g, ""); // remove non-digit characters
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

    fetch(`http://localhost:4000/signup`, {
      credentials: "include",
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(obj),
    })
      .then((res) => res.text())
      .then((text) => {
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      })
      .then((data) => {
        if (typeof data === "object") {
          navigate("/login");
        } else {
          throw new Error(data);
        }
      })
      .catch((err) => alert(err.message))
      .finally(() => setLoader(false));
    navigate("/login");
  };
  return (
    <>
      {
        <ThemeProvider theme={theme}>
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
              SB database by Samin⚡️
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
                              type={field.type}
                              autoComplete={`${s.name}.${field.name}`}
                              onChange={handelChange}
                            />
                          )}
                        </Grid>
                      ));
                    } else {
                      return (
                        <Grid key={s.name} item xs={12} sm={s.block ? 12 : 6}>
                          {s.type === "boolean" ? (
                            <FormControlLabel
                              control={<Switch color="primary" name={s.name} />}
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
                              name={s.name}
                              type={s.type}
                              autoComplete={s.name}
                              onChange={handelChange}
                            />
                          )}
                        </Grid>
                      );
                    }
                  })}
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={!isFormValid}
                  sx={{ mt: 3, mb: 2 }}>
                  Sign up
                </Button>
                <Button
                  style={{ backgroundColor: "#4ed2c1" }}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}>
                  <Link
                    style={{ textDecoration: "none", color: "white" }}
                    to="/login">
                    Is there an existing account? Log in here
                  </Link>
                </Button>
              </Box>
            </Box>
          </Container>
          <br /> <br /> <br /> <br />
        </ThemeProvider>
      }
    </>
  );
}
