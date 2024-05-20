import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import "../../../styles/operation.css";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import SaveIcon from "@mui/icons-material/Save";

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

export function EditOperationInputs({ item, errors, onInputChange, save }) {
  EditOperationInputs.propTypes = {
    item: PropTypes.any,
    errors: PropTypes.object,
    onInputChange: PropTypes.func,
    save: PropTypes.func,
  };

  return (
    <>
      {
        <TableContainer component={Paper} id="container">
          <div className="createOperationTitle">
            <h4>update data</h4>
          </div>
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            id="cssForMobile">
            <TableHead id="forMobile">
              <TableRow>
              <StyledTableCell>Agent Name</StyledTableCell>
              <StyledTableCell align="right">Team Name</StyledTableCell>
              <StyledTableCell align="right">Call Volume</StyledTableCell>
              <StyledTableCell align="right">Productivity</StyledTableCell>
              <StyledTableCell align="right">Disconnection - TV</StyledTableCell>
              <StyledTableCell align="right">Disconnection - Fiber</StyledTableCell>
              <StyledTableCell align="right">Retention Rate - TV</StyledTableCell>
              <StyledTableCell align="right">Retention Rate - Fiber</StyledTableCell>
              <StyledTableCell align="right">SMT</StyledTableCell>
              <StyledTableCell align="right">Update Details</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow id="boxCardsInputs">
                <StyledTableCell component="th" scope="row">
                  <TextField
                    inputProps={{ style: { textAlign: "center" } }}
                    disabled
                    size="small"
                    id="nameAgent"
                    label="representative name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={item.nameAgent}
                    onChange={onInputChange}
                    error={Boolean(errors.nameAgent)}
                    helperText={errors.nameAgent}
                    style={{ width: "100%" }}
                  />
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  <TextField
                    inputProps={{ style: { textAlign: "center" } }}
                    disabled
                    size="small"
                    id="teamName"
                    label="team name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={item.teamName}
                    onChange={onInputChange}
                    error={Boolean(errors.teamName)}
                    helperText={errors.teamName}
                    style={{ width: "100%" }}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    inputProps={{ style: { textAlign: "center" }, maxLength: 2}}
                    size="small"
                    id="numberCalls"
                    label="Number of calls"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={item.numberCalls}
                    onChange={onInputChange}
                    error={Boolean(errors.numberCalls)}
                    helperText={errors.numberCalls}
                    style={{ width: "63%" }}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    inputProps={{ style: { textAlign: "center" },maxLength: 4}}
                    size="small"
                    id="productivity"
                    label="fertility"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={item.productivity}
                    onChange={onInputChange}
                    error={Boolean(errors.productivity)}
                    helperText={errors.productivity}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    inputProps={{ style: { textAlign: "center" },maxLength: 2}}
                    size="small"
                    id="tvDisconnection"
                    label="Disconnect - TV"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={item.tvDisconnection}
                    onChange={onInputChange}
                    error={Boolean(errors.tvDisconnection)}
                    helperText={errors.tvDisconnection}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    inputProps={{ style: { textAlign: "center" },maxLength: 2}}
                    size="small"
                    id="fiberDisconnection"
                    label="Disconnect - Fiber"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={item.fiberDisconnection}
                    onChange={onInputChange}
                    error={Boolean(errors.fiberDisconnection)}
                    helperText={errors.fiberDisconnection}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    inputProps={{ style: { textAlign: "center" } }}
                    size="small"
                    id="simurTV"
                    label="Retention percentage - TV"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={item.simurTV}
                    onChange={onInputChange}
                    error={Boolean(errors.simurTV)}
                    helperText={errors.simurTV}
                    disabled
                    style={{ backgroundColor: item.simurTVColor }}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    inputProps={{ style: { textAlign: "center" } }}
                    size="small"
                    id="simurTV"
                    label="Retention percentage - Fiber"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={item.simurFiber}
                    onChange={onInputChange}
                    error={Boolean(errors.simurFiber)}
                    helperText={errors.simurFiber}
                    disabled
                    style={{ backgroundColor: item.simurFiberColor }}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    inputProps={{ style: { textAlign: "center" },maxLength: 3}}
                    size="small"
                    id="satisfaction"
                    label="Sgt"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={item.satisfaction}
                    onChange={onInputChange}
                    error={Boolean(errors.satisfaction)}
                    helperText={errors.satisfaction}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    id="btnCreateAndPress"
                    style={{ width: "auto" }}
                    onClick={save}>
                    Save
                    <SaveIcon />
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
