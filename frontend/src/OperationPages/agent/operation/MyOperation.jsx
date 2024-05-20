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
import moment from "moment";
import "../../../styles/operation.css";
import EditOperation from "../../../Agent/operationProcess/editOperation/EditOperation";
import CreateOperation from "../../../Agent/operationProcess/creacteOperation/CreateOperation";
import NewSale from "../../../Agent/SalesProcess/newSale/NewSale";
import DeleteOperation from "../../../Agent/operationProcess/deleteOperation/DeleteOperation";
import { GeneralContext } from "../../../App";

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

export default function MyOperation() {
  const [operation, setOperation] = useState([]);
  const { snackbar } = useContext(GeneralContext);

  useEffect(() => {
    const token = localStorage.token;
    if (!token) {
      window.location.href = "/login";
    }
    fetch(`http://localhost:4000/api/operationId`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOperation(data);
        setTimeout(() => {
          snackbar(data.message ? data.message : "The operation was loaded successfully!");
        }, 2000);
      });
  }, []);

  return (
    <>
      <div className="btnGroup">
        {operation.length > 0 ? (
          operation.map((operation, index) => (
            <div
              key={index}
              className="btnGroup"
              style={{ flexDirection: "column" }}>
              <div className="titleOperationAndAgents">
                <h4>{`The daily operation of: ${operation.nameAgent}`}</h4>
              </div>
              <CreateOperation/>
              <div
                className="searchUser"
                style={{
                  display: "flex",
                  border: "1px solid black",
                  borderRadius: "10px",
                }}></div>
            </div>
          ))
        ) : (
          <CreateOperation setOperation={setOperation} dataOperation={{}} />
        )}
      </div>

      {Array.isArray(operation) &&
        operation.map((operation, index) => (
          <div key={index} className="btnGroup">
            {operation && (
              <NewSale
                theIDoperation={operation.bizNumber}
                dataOperation={operation}
              />
            )}
          </div>
        ))}
      <TableContainer component={Paper} id="container">
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          {operation && operation.length > 0 && (
            <TableHead>
              <TableRow>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Team Name</StyledTableCell>
                <StyledTableCell>Representative Name</StyledTableCell>
                <StyledTableCell align="right">Number of Calls</StyledTableCell>
                <StyledTableCell align="right">Productivity</StyledTableCell>
                <StyledTableCell align="right">Disconnection - TV</StyledTableCell>
                <StyledTableCell align="right">Disconnection - Fiber</StyledTableCell>
                <StyledTableCell align="right">Retention Rate - TV</StyledTableCell>
                <StyledTableCell align="right">
                Retention Rate - Fiber
                </StyledTableCell>
                <StyledTableCell align="right">Sales- Fiber</StyledTableCell>
                <StyledTableCell align="right">Sales- TV</StyledTableCell>
                <StyledTableCell align="right">EasyMesh</StyledTableCell>
                <StyledTableCell align="right">Upgrade</StyledTableCell>
                <StyledTableCell align="right">Action Target</StyledTableCell>
                <StyledTableCell align="right">SMT</StyledTableCell>
                <StyledTableCell align="right">Update Details</StyledTableCell>
                <StyledTableCell align="right">Delete Operations</StyledTableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {Array.isArray(operation) &&
              operation.map((operation, index) => (
                <StyledTableRow key={operation.id || index}>
                  <StyledTableCell component="th" scope="row">
                    {moment(operation.createTime).format("DD/MM/YYYY")}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {operation.teamName}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {operation.nameAgent}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {operation.numberCalls}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {operation.productivity}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {operation.tvDisconnection}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {operation.fiberDisconnection}
                  </StyledTableCell>
                  <StyledTableCell
                    align="right"
                    style={{
                      backgroundColor:
                        parseFloat(operation.simurTV.replace("%", "")) / 100 >=
                        0.79
                          ? "#62a462"
                          : parseFloat(operation.simurTV.replace("%", "")) /
                              100 >=
                            0.67
                          ? "#c1c16f"
                          : "#ad6262",
                    }}>
                    {operation.simurTV}
                  </StyledTableCell>
                  <StyledTableCell
                    align="right"
                    style={{
                      backgroundColor:
                        parseFloat(operation.simurFiber.replace("%", "")) /
                          100 >=
                        0.79
                          ? "#62a462"
                          : parseFloat(operation.simurFiber.replace("%", "")) /
                              100 >=
                            0.67
                          ? "#c1c16f"
                          : "#ad6262",
                    }}>
                    {operation.simurFiber}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {operation.sellerFiber}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {operation.sellerTV}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {operation.easyMesh}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {operation.upgradeProgress}
                  </StyledTableCell>
                  <StyledTableCell
                    align="right"
                    style={{
                      backgroundColor:
                        operation.sellerFiber +
                          operation.easyMesh +
                          operation.upgradeProgress +
                          operation.sellerTV >
                        3
                          ? "#62a462"
                          : "#ad6262",
                    }}>
                    {operation.sellerFiber +
                      operation.easyMesh +
                      operation.upgradeProgress +
                      operation.sellerTV +
                      " / 4"}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {operation.satisfaction}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <EditOperation
                      theIDoperation={operation.bizNumber}
                      dataOperation={operation}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <DeleteOperation
                      theIDoperation={operation.bizNumber}
                      dataOperation={operation}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
