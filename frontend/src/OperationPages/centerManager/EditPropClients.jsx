import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { Avatar, Button, Grid, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { FormControlLabel } from "@mui/material";
import { Switch } from "@mui/material";
import { Container } from "@mui/material";
import clientStructure from "../../userIntegrated/ClientStructure";
import "../../styles/operation.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
};
EditPropClients.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  agentDataUpDate: PropTypes.object,
  setAgentDataUpDate: PropTypes.func.isRequired,
  errors: PropTypes.object,
  handelChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isFormValid: PropTypes.bool,
};

export function EditPropClients({
  open,
  handleClose,
  agentDataUpDate,
  errors,
  handelChange,
  handleSubmit,
  setAgentDataUpDate,
  isFormValid,
}) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Container component="main" maxWidth="s">
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
              עדכן פרטים ל משתמש
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}>
              <Grid container spacing={2} id="theBoxUserEdit">
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
                                checked={agentDataUpDate[s.name][field.name]}
                                onChange={(event) => {
                                  const updatedData = { ...agentDataUpDate };
                                  updatedData[s.name][field.name] =
                                    event.target.checked;
                                  setAgentDataUpDate(updatedData);
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
                            type={field.type}
                            autoComplete={`${s.name}.${field.name}`}
                            onChange={handelChange}
                            value={agentDataUpDate[s.name][field.name]}
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
                                name={s.name}
                                checked={agentDataUpDate[s.name]}
                                onChange={(event) => {
                                  const updatedData = { ...agentDataUpDate };
                                  updatedData[s.name] = event.target.checked;
                                  setAgentDataUpDate(updatedData);
                                }}
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
                            name={s.name}
                            type={s.type}
                            autoComplete={s.name}
                            onChange={handelChange}
                            value={agentDataUpDate[s.name]}
                            style={{
                              display: s.name === "password" ? "none" : "block",
                            }}
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
                disabled={!isFormValid}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{ backgroundColor: "#4ed2c1" }}>
                עדכן פרטים
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Modal>
  );
}
