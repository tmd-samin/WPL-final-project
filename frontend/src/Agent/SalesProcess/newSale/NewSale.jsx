import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { useContext } from "react";
import { GeneralContext } from "../../../App";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import "../../../styles/CreateCards.css";
import NewSaleInputs from "./NewSaleInputs";
import { handleInputSale } from "../../../components/handleInput";
import confetti from "canvas-confetti";
import { jwtDecode } from "jwt-decode";
import { schemaSales } from "../../../schemas/schemaSale";
import PropTypes from "prop-types";

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

export default function NewSale({ dataOperation, theIDoperation }) {
  NewSale.propTypes = {
    dataOperation: PropTypes.shape({
      sellerFiber: PropTypes.number,
      sellerTV: PropTypes.number,
      easyMesh: PropTypes.number,
      upgradeProgress: PropTypes.number,
      targets: PropTypes.number,
      satisfaction: PropTypes.string,
      bizNumber: PropTypes.number,
    }).isRequired,
    theIDoperation: PropTypes.number.isRequired,
  };

  const { setIsLoader } = useContext(GeneralContext);

  const initialValues = useMemo(
    () => ({
      sellerFiber: dataOperation.sellerFiber || "",
      sellerTV: dataOperation.sellerTV || "",
      easyMesh: dataOperation.easyMesh || "",
      targets: dataOperation.targets || "",
      upgradeProgress: dataOperation.upgradeProgress || "",
      satisfaction: dataOperation.satisfaction || "",
      bizNumber: dataOperation.bizNumber,
    }),
    [dataOperation]
  );

  const [, setItem] = useState(initialValues);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [errors, setErrors] = useState({});
  const [, setIsFormValid] = useState(false);

  const { snackbar } = useContext(GeneralContext);

  const [saleData, setSaleData] = useState({
    nameAgent: "",
    teamName: "",
    sellerFiber: "",
    sellerTV: "",
    easyMesh: "",
    upgradeProgress: "",
    targets: 2,
    customerCode: "",
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
    setSaleData((prevState) => ({ ...prevState, teamName }));
  }, [teamName]);

  useEffect(() => {
    setSaleData((prevState) => ({ ...prevState, nameAgent }));
  }, [nameAgent]);

  const onInputChange = (e) => {
    handleInputSale(
      e,
      saleData,
      setSaleData,
      errors,
      setErrors,
      setIsFormValid
    );
  };

  const { id } = useParams();
  useEffect(() => {
    if (id === "new") {
      setItem(initialValues);
    } else if (id !== undefined) {
      setIsLoader(true);
      fetch(`hhttp://localhost:4000/api/operationId/${id}`, {
        credentials: "include",
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setItem(data);
          setIsLoader(false);
        });
    }
  }, [id, setIsLoader, initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = schemaSales.validate(saleData);
    if (error) {
      snackbar(error.details[0].message);
      return;
    }

    const postRequest = fetch(
      `http://localhost:4000/api/dailyOperationStartSale`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.token,
        },
        body: JSON.stringify(saleData),
      }
    );

    const updatedSaleData = {
      sellerFiber:
        parseFloat(dataOperation.sellerFiber) +
        parseFloat(saleData.sellerFiber),
      sellerTV:
        parseFloat(dataOperation.sellerTV) + parseFloat(saleData.sellerTV),
      easyMesh:
        parseFloat(dataOperation.easyMesh) + parseFloat(saleData.easyMesh),
      upgradeProgress:
        parseFloat(dataOperation.upgradeProgress) +
        parseFloat(saleData.upgradeProgress),
      customerCode: saleData.customerCode,
    };

    const putRequest = fetch(
      `http://localhost:4000/api/dailyOperationAgentUpdateForSale/${theIDoperation}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.token,
        },
        body: JSON.stringify(updatedSaleData),
      }
    );

    Promise.all([postRequest, putRequest])
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then(([saleData]) => {
        setSaleData(saleData);
        handleClose();
        snackbar(
          `The sale of a customer code: ${updatedSaleData.customerCode} Successfully added!`
        );

        const confettiCanvas = document.getElementById("confetti-canvas");
        confetti(confettiCanvas, {
          particleCount: 100,
          spread: 70,
          decay: 0.9,
          origin: { y: 0.6 },
        });
        setTimeout(() => {
          window.location.reload();
        }, 1800);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Box>
      <Button
        variant="contained"
        id="BtnStart"
        onClick={handleOpen}
        style={{ width: "auto" }}>
        Add a sale
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box id="titleSale" sx={style}>
          <NewSaleInputs
            nameAgent={nameAgent}
            teamName={teamName}
            saleData={saleData}
            onInputChange={onInputChange}
            errors={errors}
            handleSubmit={handleSubmit}
          />
        </Box>
      </Modal>
    </Box>
  );
}
