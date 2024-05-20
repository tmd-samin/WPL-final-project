import React from "react";
import Modal from "@mui/material/Modal";
import { useState, useEffect } from "react";
import "../../../styles/CreateCards.css";
import { useContext } from "react";
import { GeneralContext } from "../../../App";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { jwtDecode } from "jwt-decode";
import { schemaOperations } from "../../../schemas/schemaOperation";
import {
  calculatePercentageTVcreate,
  calculatePercentageFiberCreate,
} from "../../../components/calculatePercentage";
import { handleInput } from "../../../components/handleInput";
import CreateOperationInputs from "./CreateOperationInputs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function CreateOperation() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [errors, setErrors] = useState({});
  const [, setIsFormValid] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const { snackbar } = useContext(GeneralContext);

  const [formData, setFormData] = useState({
    nameAgent: "",
    numberCalls: 0,
    productivity: "",
    tvDisconnection: 0,
    fiberDisconnection: 0,
    simurTV: "",
    simurFiber: "",
    teamName: "",
    satisfaction: "",
  });

  const [user, setUser] = useState({
    name: {
      first: "",
      last: "",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    fetch(`http://localhost:4000/api/user/${userId}`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });
  }, []);

  const [nameAgent, setNameAgent] = useState("");
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    if (user && user.name && user.name.first) {
      setNameAgent(user.name.first + " " + user.name.last);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.teamName) {
      setTeamName(user.teamName);
    }
  }, [user]);

  useEffect(() => {
    setFormData((prevState) => ({ ...prevState, teamName }));
  }, [teamName]);

  useEffect(() => {
    setFormData((prevState) => ({ ...prevState, nameAgent }));
  }, [nameAgent]);

  useEffect(() => {
    calculatePercentageTVcreate(formData, setFormData);
  }, [formData.numberCalls, formData.tvDisconnection, formData.simurTV]);

  useEffect(() => {
    calculatePercentageFiberCreate(formData, setFormData);
  }, [formData.numberCalls, formData.fiberDisconnection, formData.simurFiber]);

  const onInputChange = (e) => {
    handleInput(e, formData, setFormData, errors, setErrors, setIsFormValid);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = schemaOperations.validate(formData);
    if (error) {
      snackbar(error.details[0].message);
      return;
    }
    fetch(`http://localhost:4000/api/dailyOperationAgentStart`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.token,
      },
      body: JSON.stringify(formData),
    }).then((data) => {
      setFormData(data);
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      localStorage.setItem(`submitTime-${userId}`, new Date());
      snackbar("The operation was created successfully");
      setTimeout(() => {
        window.location.href = "/dailyOperation";
      }, 1500);
      setIsDisabled(true);
      handleClose();
      calculatePercentageTVcreate(formData, setFormData);
      calculatePercentageFiberCreate(formData, setFormData);
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    const submitTime = localStorage.getItem(`submitTime-${userId}`);
    if (submitTime) {
      const now = new Date();
      const timeDifference = now.getTime() - new Date(submitTime).getTime();
      const differenceInHours = timeDifference / (1000 * 60 * 60);
      if (differenceInHours < 24) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
        localStorage.removeItem(`submitTime-${userId}`);
      }
    }
  }, []);

  return (
    <Box>
      <Button
        disabled={isDisabled}
        variant="contained"
        id="BtnStart"
        onClick={handleOpen}
        style={{ width: "auto" }}>
        Start data
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box id="boxCards" sx={style}>
          <CreateOperationInputs
            nameAgent={nameAgent}
            teamName={teamName}
            formData={formData}
            onInputChange={onInputChange}
            errors={errors}
            handleSubmit={handleSubmit}
          />
        </Box>
      </Modal>
    </Box>
  );
}
