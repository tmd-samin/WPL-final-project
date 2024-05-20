import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import { GeneralContext } from "../../../App";
import { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import { useMemo } from "react";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { DeleteSaleProp } from "./DeleteSaleProp";

DeleteSale.propTypes = {
  dataOperationSale: PropTypes.shape({
    teamName: PropTypes.string,
    nameAgent: PropTypes.string,
    sellerFiber: PropTypes.number,
    sellerTV: PropTypes.number,
    easyMesh: PropTypes.number,
    upgradeProgress: PropTypes.number,
    customerCode: PropTypes.string,
  }).isRequired,
  theIDoperationSale: PropTypes.number.isRequired,
};

export default function DeleteSale({ dataOperationSale, theIDoperationSale }) {
  const { snackbar, setIsLoader } = useContext(GeneralContext);

  const initialValues = useMemo(
    () => ({
      teamName: dataOperationSale.teamName || "",
      nameAgent: dataOperationSale.nameAgent || "",
      sellerFiber: dataOperationSale.sellerFiber || "",
      sellerTV: dataOperationSale.sellerTV || "",
      easyMesh: dataOperationSale.easyMesh || "",
      upgradeProgress: dataOperationSale.upgradeProgress || "",
      customerCode: dataOperationSale.customerCode || "",
    }),
    [dataOperationSale]
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
      fetch(`http://localhost:4000/api/operationSale/${id}`, {
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

  const DeleteSale = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/api/dailyOperationStartSale/${theIDoperationSale}`,
        {
          credentials: "include",
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: localStorage.token,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      handleClose();
      snackbar(`מכירה של ${item.customerCode} נמחק בהצלחה`, "success");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      snackbar(err.message, "error");
    }
  };

  return (
    <Box>
      <IconButton
        id="btnCreateAndPress"
        style={{ width: "auto" }}
        onClick={handleOpen}>
        <DeleteForeverIcon />
      </IconButton>
      <DeleteSaleProp
        open={open}
        handleClose={handleClose}
        item={item}
        DeleteSale={DeleteSale}
      />
    </Box>
  );
}
