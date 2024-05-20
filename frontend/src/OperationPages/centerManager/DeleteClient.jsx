import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import { GeneralContext } from "../../App";
import { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import { useMemo } from "react";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { DeleteUserProp } from "./DeleteUserProp";

DeleteClient.propTypes = {
  dataClient: PropTypes.shape({
    name: PropTypes.shape({
      first: PropTypes.string.isRequired,
      middle: PropTypes.string,
      last: PropTypes.string.isRequired,
    }).isRequired,
    teamName: PropTypes.string.isRequired,
  }),
  theIDclient: PropTypes.string.isRequired,
};

export default function DeleteClient({ theIDclient, dataClient }) {
  const { snackbar, setIsLoader } = useContext(GeneralContext);

  const initialValues = useMemo(
    () => ({
      name: {
        first: dataClient.name.first,
        middle: dataClient.name.middle,
        last: dataClient.name.last,
      },
      teamName: dataClient.teamName,
    }),
    [dataClient]
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

  const DeleteUser = async (e) => {
    e.preventDefault();
    try {
      fetch(`http://localhost:4000/api/user/${theIDclient}`, {
        credentials: "include",
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.token,
        },
      });
      handleClose();
      snackbar(`The user ${item.name.first} was successfully deleted`, "success");
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
        style={{ width: "auto" }}
        id="btnCreateAndPress"
        onClick={handleOpen}>
        <DeleteForeverIcon />
      </IconButton>
      <DeleteUserProp
        open={open}
        handleClose={handleClose}
        item={item}
        DeleteUser={DeleteUser}
      />
    </Box>
  );
}
