import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import EditSaleInputs from "./EditSaleInputs";
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
EditPropSales.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  saleDataUpDate: PropTypes.object,
  errors: PropTypes.object,
  onInputChange: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
};

export function EditPropSales({
  open,
  handleClose,
  saleDataUpDate,
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
      <Box id="titleSale" sx={style}>
        <EditSaleInputs
          saleDataUpDate={saleDataUpDate}
          errors={errors}
          onInputChange={onInputChange}
          save={save}
        />
      </Box>
    </Modal>
  );
}
