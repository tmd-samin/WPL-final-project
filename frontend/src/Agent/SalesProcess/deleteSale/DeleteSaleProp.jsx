import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import moment from "moment";
import IconButton from "@mui/material/IconButton";
import "../../../styles/operation.css";

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
DeleteSaleProp.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  errors: PropTypes.object,
  DeleteSale: PropTypes.func.isRequired,
};

export function DeleteSaleProp({ open, handleClose, item, DeleteSale }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box id="buttonsModalWin" style={{ height: "auto" }} sx={style}>
        <div className="QuestionModal" style={{ height: "auto" }}>
        <h2>{`Are you sure you want to delete the sale of ${item.nameAgent}?`}</h2>
        <h3>{`Agent Name: ${item.nameAgent}`}</h3>
        <h3>{`Team Name: ${item.teamName}`}</h3>
        <h3>{`Customer Code: ${item.customerCode}`}</h3>
        <h3>{`Creation Date: ${moment(item.createTime).format(
            "DD/MM/YYYY"
          )}`}</h3>
          <h3>
            The sale includes: <br />
            Fiber: {item.sellerFiber} TV: {item.sellerTV} <br />
            EasyMesh: {item.easyMesh} Upgrade: {item.upgradeProgress}
            <br />
          </h3>
          <div className="buttonsModal">
            <IconButton onClick={DeleteSale} id="btnCreateAndPress">
              Delete
            </IconButton>
            <IconButton onClick={handleClose} id="btnCreateAndPress">
              cancelation
            </IconButton>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
