import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import moment from "moment";
import IconButton from "@mui/material/IconButton";
import "../../styles/operation.css";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: "15px",
    padding: "5px",
    margin: "5px",
    textAlign: "center",
    width: "100px",
    border: "1px solid white",
    borderRadius: "8px 8px 0 0",
    textShadow: "1px 1px 6px white",
    boxShadow: "1px 1px 3px 1px white",
  },
  [`&.${tableCellClasses.body}`]: {
    padding: "5px",
    margin: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    width: "100px",
    textAlign: "center",
    border: "1px solid black",
    boxShadow: "1px 1px 8px  1px black",
    textShadow: "1px 1px 6px black",
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

SearchBarOperationProp.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  searchResults: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  error: PropTypes.object,
  loading: PropTypes.bool,
  handleSelectAgent: PropTypes.func.isRequired,
  selectedAgent: PropTypes.object,
  searchTerm: PropTypes.string,
};

export function SearchBarOperationProp({
  open,
  handleClose,
  searchResults,
  error,
  loading,
  handleSelectAgent,
  selectedAgent,
  searchTerm,
}) {

if (!searchTerm) {
  return [];
}

const filteredResults = Array.isArray(searchResults)
  ? searchResults.filter(
      (agent) =>
        (agent.nameAgent &&
          agent.nameAgent.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (agent.simurFiber &&
          agent.simurFiber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (agent.simurTV && 
          agent.simurTV.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (agent.satisfaction &&
          agent.satisfaction.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (agent.createTime &&
          agent.createTime.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (agent.teamName &&
          agent.teamName.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  : [];

  return (
    <Modal
      style={{ height: "100%" }}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box id="buttonsModalWin" sx={style}>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <div className="QuestionModal" style={{ maxHeight: '500px', overflowY: 'scroll' }}>
          {filteredResults.length > 0 && (
            <ul>
              <h4>Search results</h4>
              <h4>{`The number of employees in the search is: ${parseFloat(filteredResults.length)}`}</h4>
              {filteredResults.map((agent) => (
                <li key={agent._id}>
                  <p>{`Agent: ${agent.nameAgent}`}</p>
                  <p>{`On date: ${moment(agent.createTime).format("DD/MM/YYYY")}`}</p>
                  <p>{`With TV retention rate data: ${agent.simurTV}, and with fiber retention rate data: ${agent.simurFiber}.`}</p>
                  <IconButton
                    id="btnCreateAndPress"
                    onClick={() => handleSelectAgent(agent)}>
                    choose
                  </IconButton>
                </li>
              ))}
              {selectedAgent && (
                <div>
                  <>
                    {
                      <TableContainer component={Paper} id="container">
                        <Table
                          sx={{ minWidth: 700 }}
                          aria-label="customized table">
                          <TableHead>
                            <TableRow>
                              <StyledTableCell>Date</StyledTableCell>
                              <StyledTableCell>Team Name</StyledTableCell>
                              <StyledTableCell>Representative Name</StyledTableCell>
                              <StyledTableCell align="right">Call Volume</StyledTableCell>
                              <StyledTableCell align="right">Productivity</StyledTableCell>
                              <StyledTableCell align="right">Disconnection - TV</StyledTableCell>
                              <StyledTableCell align="right">Disconnection - Fiber</StyledTableCell>
                              <StyledTableCell align="right">Retention Rate - Fiber</StyledTableCell>
                              <StyledTableCell align="right">Retention Rate - TV</StyledTableCell>
                              <StyledTableCell align="right">
                                Sales - Fiber
                              </StyledTableCell>
                              <StyledTableCell align="right">
                                {" "}
                                Sales - TV
                              </StyledTableCell>
                              <StyledTableCell align="right">EasyMesh</StyledTableCell>
                              <StyledTableCell align="right">Upgrade</StyledTableCell>
                              <StyledTableCell align="right">SMT</StyledTableCell>
                              <StyledTableCell align="right">Cumulative Actions</StyledTableCell>
                              <StyledTableCell align="right">Update Details</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                                <StyledTableRow>
                                  <StyledTableCell component="th" scope="row">
                                    {moment(selectedAgent.createTime).format(
                                      "DD/MM/YYYY"
                                    )}
                                  </StyledTableCell>
                                  <StyledTableCell component="th" scope="row">
                                    {selectedAgent.teamName}
                                  </StyledTableCell>
                                  <StyledTableCell component="th" scope="row">
                                    {selectedAgent.nameAgent}
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    {selectedAgent.numberCalls}
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    {selectedAgent.productivity}
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    {selectedAgent.tvDisconnection}
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    {selectedAgent.fiberDisconnection}
                                  </StyledTableCell>
                                  <StyledTableCell
                                    align="right"
                                    style={{
                                      backgroundColor:
                                        parseFloat(
                                          selectedAgent.simurFiber.replace(
                                            "%",
                                            ""
                                          )
                                        ) /
                                          100 >=
                                        0.79
                                          ? "#62a462"
                                          : parseFloat(
                                              selectedAgent.simurFiber.replace(
                                                "%",
                                                ""
                                              )
                                            ) /
                                              100 >=
                                            0.67
                                          ? "#c1c16f"
                                          : "#ad6262",
                                    }}>
                                    {selectedAgent.simurFiber}
                                  </StyledTableCell>
                                  <StyledTableCell
                                    align="right"
                                    style={{
                                      backgroundColor:
                                        parseFloat(
                                          selectedAgent.simurTV.replace("%", "")
                                        ) /
                                          100 >=
                                        0.79
                                          ? "#62a462"
                                          : parseFloat(
                                              selectedAgent.simurTV.replace(
                                                "%",
                                                ""
                                              )
                                            ) /
                                              100 >=
                                            0.67
                                          ? "#c1c16f"
                                          : "#ad6262",
                                    }}>
                                    {selectedAgent.simurTV}
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    {selectedAgent.sellerFiber}
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    {selectedAgent.sellerTV}
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    {selectedAgent.easyMesh}
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    {selectedAgent.upgradeProgress}
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    {selectedAgent.satisfaction}
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    {selectedAgent.targets}
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    <IconButton>
                                      <EditIcon />
                                    </IconButton>
                                  </StyledTableCell>
                                </StyledTableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    }
                  </>
                  <div className="buttonsModal">
                    <IconButton onClick={handleClose} id="btnCreateAndPress">
                     To close
                    </IconButton>
                  </div>
                </div>
              )}
            </ul>
          )}
          {filteredResults.length === 0 && (
            <div>
              <h4>Search results :</h4>
              <p>No details found for: {searchTerm}</p>
              <IconButton onClick={handleClose} id="btnCreateAndPress">
               To close
              </IconButton>
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
}
