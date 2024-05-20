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
import { GeneralContext } from "../../../App";
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

IncrementalOperatingAverageSale.propTypes = {
  selectedMonthSales: PropTypes.string,
  setSelectedMonthSales: PropTypes.func,
};

export default function IncrementalOperatingAverageSale({
  selectedMonthSales,
  setSelectedMonthSales,
}) {
  const [incrementalAverageSale, incrementalSetOperationAverageSale] = useState(
    []
  );
  const { snackbar } = useContext(GeneralContext);

  const handleMonthChange = (event) => {
    setSelectedMonthSales(event.target.value);
  };

  useEffect(() => {
    fetch(`http://localhost:4000/api/incrementalOperatingAverageSale`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        incrementalSetOperationAverageSale([data]);
        snackbar(data.message ? data.message : "Daily sales have been loaded successfully!");
      });
  }, []);

  let operationAverageSale = [];
  if (incrementalAverageSale[0]) {
    operationAverageSale = Object.entries(incrementalAverageSale[0]).map(
      ([monthYear, totals]) => ({
        monthYear,
        ...totals,
      })
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
      {
        <TableContainer component={Paper} id="container">
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>the current month</StyledTableCell>
                <StyledTableCell align="right">
                 Sales - Aggregate Fiber
                </StyledTableCell>
                <StyledTableCell align="right">
                  {" "}
                 Sales - Aggregate TV
                </StyledTableCell>
                <StyledTableCell align="right">
                  EasyMesh - cumulative
                </StyledTableCell>
                <StyledTableCell align="right">Upgrade - incremental</StyledTableCell>
                <StyledTableCell align="right">Total operations</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(operationAverageSale) &&
                operationAverageSale
                  .filter(
                    (operation) => operation.monthYear === selectedMonthSales
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
