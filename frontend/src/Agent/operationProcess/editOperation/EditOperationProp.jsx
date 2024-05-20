import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { EditOperationInputs } from "./EditOperationInputs";
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
EditOperationProp.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  errors: PropTypes.object,
  onInputChange: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
};

export function EditOperationProp({
  open,
  handleClose,
  item,
  errors,
  onInputChange,
  save,
}) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box id="boxCards" sx={style}>
        <EditOperationInputs
          item={item}
          errors={errors}
          onInputChange={onInputChange}
          save={save}
        />
      </Box>
    </Modal>
  );
}
