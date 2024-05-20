import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "../../../styles/operation.css";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    textAlign: "center",
    border: "1px solid white",
    borderRadius: "3px 3px 0 0",
    fontSize: "14px",
    padding: "2px 0 2px 0",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "center",
    border: "1px solid black",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: "1px solid black",
    textAlign: "center",
  },
}));

CreateOperationInputs.propTypes = {
  nameAgent: PropTypes.string.isRequired,
  teamName: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
};

CreateOperationInputs.propTypes = {
  formData: PropTypes.shape({
    nameAgent: PropTypes.string,
    numberCalls: PropTypes.number,
    productivity: PropTypes.string,
    tvDisconnection: PropTypes.number,
    fiberDisconnection: PropTypes.number,
    simurFiber: PropTypes.string,
    simurTV: PropTypes.string,
    simurFiberColor: PropTypes.string,
    simurTVColor: PropTypes.string,
    sellerFiber: PropTypes.string,
    sellerTV: PropTypes.string,
    easyMesh: PropTypes.string,
    upgradeProgress: PropTypes.string,
    satisfaction: PropTypes.string,
    teamName: PropTypes.string,
  }).isRequired,
  onInputChange: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    nameAgent: PropTypes.string,
    numberCalls: PropTypes.string,
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
    teamName: PropTypes.string,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

function CreateOperationInputs({
  formData,
  onInputChange,
  errors,
  handleSubmit,
  nameAgent,
  teamName,
}) {
  return (
    <>
      {
        <TableContainer component={Paper} id="container">
          <div className="createOperationTitle">
            <h4>Start data update</h4>
          </div>
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            id="cssForMobile">
            <TableHead id="forMobile">
              <TableRow>
              <StyledTableCell>Agent Name</StyledTableCell>
              <StyledTableCell align="right">Team Name</StyledTableCell>
              <StyledTableCell align="right">Number of Calls</StyledTableCell>
              <StyledTableCell align="right">Productivity</StyledTableCell>
              <StyledTableCell align="right">Disconnection - TV</StyledTableCell>
              <StyledTableCell align="right">Disconnection - Fiber</StyledTableCell>
              <StyledTableCell align="right">Retention Rate - Fiber</StyledTableCell>
              <StyledTableCell align="right">Retention Rate - TV</StyledTableCell>
              <StyledTableCell align="right">Customer Satisfaction</StyledTableCell>
              <StyledTableCell align="right">Update Details</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow id="boxCardsInputs">
                <StyledTableCell component="th" scope="row">
                  <TextField
                    disabled
                    inputProps={{ style: { textAlign: "center" } }}
                    size="small"
                    id="nameAgent"
                    label="שם נציג"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={nameAgent}
                    onChange={onInputChange}
                    error={Boolean(errors.nameAgent)}
                    helperText={errors.nameAgent}
                  />
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  <TextField
                    inputProps={{ style: { textAlign: "center" } }}
                    disabled
                    size="small"
                    id="teamName"
                    label="שם הצוות"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={teamName}
                    onChange={onInputChange}
                    error={Boolean(errors.teamName)}
                    helperText={errors.teamName}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    inputProps={{ style: { textAlign: "center" },maxLength: 2 }}
                    autoComplete="off"
                    size="small"
                    id="numberCalls"
                    label="Number of calls"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.numberCalls}
                    onChange={onInputChange}
                    error={Boolean(errors.numberCalls)}
                    helperText={errors.numberCalls}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    inputProps={{ style: { textAlign: "center" },maxLength: 4}}
                    autoComplete="off"
                    size="small"
                    id="productivity"
                    label="productivity"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.productivity}
                    onChange={onInputChange}
                    error={Boolean(errors.productivity)}
                    helperText={errors.productivity}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    inputProps={{ style: { textAlign: "center" },maxLength: 2}}
                    autoComplete="off"
                    size="small"
                    id="tvDisconnection"
                    label="Disconnect- TV"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.tvDisconnection}
                    onChange={onInputChange}
                    error={Boolean(errors.tvDisconnection)}
                    helperText={errors.tvDisconnection}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    inputProps={{ style: { textAlign: "center" },maxLength: 2}}
                    autoComplete="off"
                    size="small"
                    id="fiberDisconnection"
                    label="Disconnect- Fiber"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.fiberDisconnection}
                    onChange={onInputChange}
                    error={Boolean(errors.fiberDisconnection)}
                    helperText={errors.fiberDisconnection}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    inputProps={{ style: { textAlign: "center" } }}
                    autoComplete="off"
                    size="small"
                    id="simurFiber"
                    label="Retention percentage- Fiber"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.simurFiber}
                    onChange={onInputChange}
                    error={Boolean(errors.simurFiber)}
                    helperText={errors.simurFiber}
                    style={{ backgroundColor: formData.simurFiberColor }}
                    disabled
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    inputProps={{ style: { textAlign: "center" } }}
                    autoComplete="off"
                    size="small"
                    id="simurTV"
                    label="Retention percentage- TV"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.simurTV}
                    onChange={onInputChange}
                    error={Boolean(errors.simurTV)}
                    helperText={errors.simurTV}
                    style={{ backgroundColor: formData.simurTVColor }}
                    disabled
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    inputProps={{ style: { textAlign: "center" }, maxLength: 3}}
                    autoComplete="off"
                    size="small"
                    id="satisfaction"
                    label="Sgt"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.satisfaction}
                    onChange={onInputChange}
                    error={Boolean(errors.satisfaction)}
                    helperText={errors.satisfaction}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    id="btnCreateAndPress"
                    style={{ width: "auto" }}
                    onClick={handleSubmit}>
                    <SendIcon />
                    Update
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      }
    </>
  );
}

export default CreateOperationInputs;
