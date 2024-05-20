import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useContext, useState } from "react";
import { useEffect } from "react";
import "../../../styles/operation.css";
import PropTypes from "prop-types";
import { GeneralContext } from "../../../App";
import moment from "moment";

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
    fontSize: "16px",
  },
}));

OperatingAverageTeamPerAgent.propTypes = {
  selectedMonth: PropTypes.string,
  setSelectedMonth: PropTypes.func,
  selectedAgent: PropTypes.string,
  setSelectedAgent: PropTypes.func,
};
export default function OperatingAverageTeamPerAgent({
  selectedMonth,
  setSelectedMonth,
  selectedAgent,
  setSelectedAgent,
}) {
  const [operationAverage, setOperationAverage] = useState([]);
  const { snackbar } = useContext(GeneralContext);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleAgentChange = (event) => {
    setSelectedAgent(event.target.value);
  };

  useEffect(() => {
    fetch(`http://localhost:4000/api/incrementalOperationTeam`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOperationAverage([data]);
        snackbar(
          data.message ? data.message : "The operating average of the month has been loaded successfully!"
        );
      });
  }, []);

  let operationAverageArray = [];
  if (operationAverage[0]) {
    operationAverageArray = Object.entries(operationAverage[0]).map(
      ([monthYear, totals]) => ({
        monthYear,
        ...totals,
      })
    );
  }

  const filteredOperations = operationAverageArray.filter((operation) => {
    const operationMonth = moment(operation.createTime).format("MM/YYYY");
    return (
      operation.nameAgent === selectedAgent && operationMonth === selectedMonth
    );
  });

  return (
    <>
      <select onChange={handleMonthChange} style={{ display: "none" }}>
        {operationAverage[0] &&
          Object.keys(operationAverage[0]).map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
      </select>
      <select onChange={handleAgentChange} style={{ display: "none" }}>
        {operationAverage[0] &&
          Object.keys(operationAverage[0]).map((agent, index) => (
            <option key={index} value={agent}>
              {agent}
            </option>
          ))}
      </select>
      {
        <TableContainer component={Paper} id="container">
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell> Cumulative Call Volume </StyledTableCell>
                <StyledTableCell align="right"> Cumulative Productivity </StyledTableCell>
                <StyledTableCell align="right">
                  Cumulative Disconnection - TV
                </StyledTableCell>
                <StyledTableCell align="right">
                  Cumulative Disconnection - Fiber
                </StyledTableCell>
                <StyledTableCell align="right">
                  Cumulative Retention Rate - Fiber
                </StyledTableCell>
                <StyledTableCell align="right">
                  Cumulative Retention Rate - TV
                </StyledTableCell>
                <StyledTableCell align="right">
                  Cumulative Sales - Fiber
                </StyledTableCell>
                <StyledTableCell align="right">
                  {" "}
                  Cumulative Sales - TV
                </StyledTableCell>
                <StyledTableCell align="right">
                  Cumulative EasyMesh
                </StyledTableCell>
                <StyledTableCell align="right"> Cumulative Upgrade </StyledTableCell>
                <StyledTableCell align="right"> Cumulative SMT </StyledTableCell>
                <StyledTableCell align="right"> Cumulative Performance </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(filteredOperations) &&
                filteredOperations.map((operationAverage, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      {operationAverage.numberCalls}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {typeof operationAverage.productivity === "number"
                        ? operationAverage.productivity.toFixed(2)
                        : operationAverage.productivity}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {operationAverage.tvDisconnection}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {operationAverage.fiberDisconnection}
                    </StyledTableCell>
                    <StyledTableCell
                      align="right"
                      style={{
                        backgroundColor:
                          parseFloat(operationAverage.simurFiber) / 100 >= 0.79
                            ? "#62a462"
                            : parseFloat(operationAverage.simurFiber) / 100 >=
                              0.67
                            ? "#c1c16f"
                            : "#ad6262",
                      }}>
                      {operationAverage.simurFiber.toFixed(2) + "%"}
                    </StyledTableCell>
                    <StyledTableCell
                      align="right"
                      style={{
                        backgroundColor:
                          parseFloat(operationAverage.simurTV) / 100 >= 0.79
                            ? "#62a462"
                            : parseFloat(operationAverage.simurTV) / 100 >= 0.67
                            ? "#c1c16f"
                            : "#ad6262",
                      }}>
                      {operationAverage.simurTV.toFixed(2) + "%"}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {operationAverage.sellerFiber}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {operationAverage.sellerTV}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {operationAverage.easyMesh}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {operationAverage.upgradeProgress}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                    {typeof operationAverage.satisfaction === "number"
                        ? operationAverage.satisfaction.toFixed(2)+"%"
                        : operationAverage.satisfaction +"%"}
                    </StyledTableCell>
                    <StyledTableCell
                      align="right"
                      style={{
                        backgroundColor:
                          operationAverage.sellerFiber +
                            operationAverage.easyMesh +
                            operationAverage.upgradeProgress +
                            operationAverage.sellerTV >
                          44
                            ? "#62a462"
                            : "#ad6262",
                      }}>
                      {operationAverage.sellerFiber +
                        operationAverage.easyMesh +
                        operationAverage.upgradeProgress +
                        operationAverage.sellerTV}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </>
  );
}
