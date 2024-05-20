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
import { DeleteOperationProp } from "./DeleteOperationProp";

DeleteOperation.propTypes = {
  dataOperation: PropTypes.shape({
    teamName: PropTypes.string,
    nameAgent: PropTypes.string,
    createTime: PropTypes.string,
  }).isRequired,
  theIDoperation: PropTypes.number.isRequired,
};

export default function DeleteOperation({ dataOperation, theIDoperation }) {
  const { snackbar, setIsLoader } = useContext(GeneralContext);

  const initialValues = useMemo(
    () => ({
      teamName: dataOperation.teamName || "",
      nameAgent: dataOperation.nameAgent || "",
      createTime: dataOperation.createTime || "",
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

  const DeleteOperation = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/api/dailyOperationAgentEnd/${theIDoperation}`,
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
      Snackbar(`Operation of ${item.nameAgent} deleted successfully`, "success");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      snackbar(err.message, "error");
    }
  };

  return (
    <Box>
      <IconButton style={{ width: "auto" }} onClick={handleOpen}>
        <DeleteForeverIcon />
      </IconButton>
      <DeleteOperationProp
        open={open}
        handleClose={handleClose}
        item={item}
        DeleteOperation={DeleteOperation}
      />
    </Box>
  );
}
