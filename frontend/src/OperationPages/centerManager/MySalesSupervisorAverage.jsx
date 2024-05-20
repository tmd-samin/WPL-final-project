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
import "../../styles/operation.css";
import { GeneralContext } from "../../App";
import PropTypes from "prop-types";

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

MySalesSupervisorAverage.propTypes = {
  selectedMonthSales: PropTypes.string,
  setSelectedMonthSales: PropTypes.func,
  selectedAgent: PropTypes.string,
  setSelectedAgent: PropTypes.func,
  selectedTeam: PropTypes.string,
  setSelectedTeam: PropTypes.func,
};

export default function MySalesSupervisorAverage({
  selectedMonthSales,
  setSelectedMonthSales,
  selectedAgent,
  setSelectedAgent,
  selectedTeam,
  setSelectedTeam,
}) {
  const [incrementalAverageSale, incrementalSetOperationAverageSale] = useState(
    []
  );
  const { snackbar } = useContext(GeneralContext);

  const handleMonthChange = (event) => {
    setSelectedMonthSales(event.target.value);
  };
  const handleAgentChange = (event) => {
    setSelectedAgent(event.target.value);
  };
  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  useEffect(() => {
    fetch(
      `http://localhost:4000/api/incrementalOperatingAverageSaleCenterManger`,
      {
        credentials: "include",
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.token,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        incrementalSetOperationAverageSale([data]);
        snackbar(data.message ? data.message : "Daily sales successfully loaded!");
      });
  }, []);

  let operationAverageSale = [];
  if (incrementalAverageSale[0]) {
    operationAverageSale = Object.entries(incrementalAverageSale[0]).flatMap(
      ([monthYear, totals]) => {
        return Object.entries(totals).map(([index, agentDetails]) => ({
          monthYear,
          ...agentDetails,
        }));
      }
    );
  }

  return (
    <>
      <select onChange={handleMonthChange} style={{ display: "none" }}>
        {incrementalAverageSale[0] &&
          Object.keys(incrementalAverageSale[0]).map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
      </select>
      <select onChange={handleAgentChange} style={{ display: "none" }}>
        {incrementalAverageSale[0] &&
          Object.keys(incrementalAverageSale[0]).map((agent, index) => (
            <option key={index} value={agent}>
              {agent}
            </option>
          ))}
      </select>
      <select onChange={handleTeamChange} style={{ display: "none" }}>
        {incrementalAverageSale[0] &&
          Object.keys(incrementalAverageSale[0]).map((team, index) => (
            <option key={index} value={team}>
              {team}
            </option>
          ))}
      </select>
      {
        <TableContainer component={Paper} id="container">
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
              <StyledTableCell>Current Month</StyledTableCell>
                <StyledTableCell align="right">
                Sales - Fiber Accumulated
                </StyledTableCell>
                <StyledTableCell align="right">
                  {" "}
                  Sales - TV Accumulated
                </StyledTableCell>
                <StyledTableCell align="right">
                  EasyMesh - Accumulated
                </StyledTableCell>
                <StyledTableCell align="right">Upgrade - Accumulated</StyledTableCell>
                <StyledTableCell align="right">Total Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {operationAverageSale
                .filter(
                  (operation) =>
                    operation.monthYear === selectedMonthSales &&
                    operation.nameAgent === selectedAgent &&
                    operation.teamName === selectedTeam
                )
                .map((operationAverage, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      {selectedMonthSales}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {operationAverage.totalSellerFiber}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {operationAverage.totalSellerTV}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {operationAverage.totalEasyMesh}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {operationAverage.totalUpgradeProgress}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {operationAverage.totalUpgradeProgress +
                        operationAverage.totalSellerFiber +
                        operationAverage.totalSellerTV +
                        operationAverage.totalEasyMesh}
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
