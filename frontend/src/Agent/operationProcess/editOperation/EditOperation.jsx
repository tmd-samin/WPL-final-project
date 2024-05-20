import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { GeneralContext } from "../../../App";
import { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import { useMemo } from "react";
import { EditOperationProp } from "./EditOperationProp";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { schemaOperations } from "../../../schemas/schemaOperation";
import {
  calculatePercentageTV,
  calculatePercentageFiber,
} from "../../../components/calculatePercentage";
import { handleInputEdit } from "../../../components/handleInput";

export default function EditOperation({ dataOperation, theIDoperation }) {
  const { snackbar, setIsLoader } = useContext(GeneralContext);
  const [errors, setErrors] = useState({});
  const [, setIsFormValid] = useState(false);

  EditOperation.propTypes = {
    dataOperation: PropTypes.shape({
      teamName: PropTypes.string,
      nameAgent: PropTypes.string,
      numberCalls: PropTypes.number,
      productivity: PropTypes.string,
      tvDisconnection: PropTypes.number,
      fiberDisconnection: PropTypes.number,
      simurFiber: PropTypes.string,
      simurTV: PropTypes.string,
      sellerFiber: PropTypes.number,
      sellerTV: PropTypes.number,
      easyMesh: PropTypes.number,
      upgradeProgress: PropTypes.number,
      satisfaction: PropTypes.string,
    }).isRequired,
    theIDoperation: PropTypes.number.isRequired,
  };

  const initialValues = useMemo(
    () => ({
      teamName: dataOperation.teamName || "",
      nameAgent: dataOperation.nameAgent || "",
      numberCalls: dataOperation.numberCalls || "",
      productivity: dataOperation.productivity || "",
      tvDisconnection: dataOperation.tvDisconnection || "",
      fiberDisconnection: dataOperation.fiberDisconnection || "",
      simurFiber: dataOperation.simurFiber || "",
      simurTV: dataOperation.simurTV || "",
      satisfaction: dataOperation.satisfaction || "",
    }),
    [dataOperation]
  );

  const [item, setItem] = useState(initialValues);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const onInputChange = (e) => {
    handleInputEdit(e, item, setItem, errors, setErrors, setIsFormValid);
  };

  useEffect(() => {
    calculatePercentageTV(item, setItem);
  }, [item.numberCalls, item.tvDisconnection, item.simurTV]);

  useEffect(() => {
    calculatePercentageFiber(item, setItem);
  }, [item.numberCalls, item.fiberDisconnection, item.simurFiber]);

  const save = async (e) => {
    e.preventDefault();
    const { error } = schemaOperations.validate(item);
    if (error) {
      snackbar(error.details[0].message);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:4000/api/dailyOperationAgentUpdate/${theIDoperation}`,
        {
          credentials: "include",
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: localStorage.token,
          },
          body: JSON.stringify(item),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      handleClose();
      snackbar("Operation has been successfully updated!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error(
        "There was a problem with the fetch operation: " + error.message
      );
    }
  };

  return (
    <Box>
      <IconButton style={{ width: "auto" }} onClick={handleOpen}>
        <EditIcon />
      </IconButton>
      <EditOperationProp
        open={open}
        handleClose={handleClose}
        item={item}
        errors={errors}
        onInputChange={onInputChange}
        save={save}
      />
    </Box>
  );
}
