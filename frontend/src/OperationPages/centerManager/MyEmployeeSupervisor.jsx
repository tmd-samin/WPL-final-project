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
import "../../styles/operation.css";
import SearchBar from "../../components/searchBar/SearchBar";
import SearchBarOperation from "../../components/searchBar/SearchBarOperation";
import { GeneralContext } from "../../App";
import EditClient from "./EditClient";
import DeleteClient from "./DeleteClient";

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

export default function MyEmployeeSupervisor() {
  const [operation, setOperation] = useState([]);
  const { snackbar } = useContext(GeneralContext);

  useEffect(() => {
    const token = localStorage.token;
    if (!token) {
      window.location.href = "/login";
    }
    fetch(`http://localhost:4000/api/users`, {
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
          snackbar(data.message ? data.message : "The operation has been loaded successfully!");
        }, 2000);
      });
  }, []);

  return (
    <>
      <div className="btnGroup">
        <div className="titleOperationAndManger" style={{ display: "grid" }}>
          <h4>{`System user management`}</h4>
          <div
            className="search-user"
            style={{
              display: "flex",
              border: "1px solid black",
              borderRadius: "10px",
            }}>
            <SearchBar />
            <SearchBarOperation />
          </div>
        </div>
      </div>
      
      <TableContainer 
      component={Paper}
      id="container"
      style={{ maxHeight: "500px", overflowY: "scroll" }}>
        <Table stickyHeader sx={{ minWidth: 700 }} aria-label="sticky table">
          {operation && operation.length > 0 && (
            <TableHead>
              <TableRow>
              <StyledTableCell>Joining Date</StyledTableCell>
              <StyledTableCell>First Name</StyledTableCell>
              <StyledTableCell>Last Name</StyledTableCell>
              <StyledTableCell align="right">Team Leader</StyledTableCell>
              <StyledTableCell align="right">Call Center Manager</StyledTableCell>
              <StyledTableCell align="right">Agent</StyledTableCell>
              <StyledTableCell align="right">Service Department</StyledTableCell>
              <StyledTableCell align="right">Retention Department</StyledTableCell>
              <StyledTableCell align="right">Team Name</StyledTableCell>
              <StyledTableCell align="right">Mobile</StyledTableCell>
              <StyledTableCell align="right">Email</StyledTableCell>
              <StyledTableCell align="right">Image</StyledTableCell>
              <StyledTableCell align="right">Edit User</StyledTableCell>
              <StyledTableCell align="right">Delete User</StyledTableCell>
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
                    {operation.name.first + " " + operation.name.middle}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {operation.name.last}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {!operation.IsBusiness ? "No" : "Yes"}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {!operation.isAdmin ? "No" : "Yes"}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {!operation.IsBusiness && !operation.isAdmin ? "Yes" : "No"}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {operation.serviceDepartment ? "Yes" : "No"}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {operation.conservationDepartment ? "Yes" : "No"}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {operation.teamName}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {operation.phone}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {operation.email}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <img
                                              src={
                          operation && operation.isAdmin
                            ? "https://ideogram.ai/api/images/direct/IaLLA8g8Th6ud05mLTPPig.png"
                            : operation && operation.IsBusiness
                            ? "https://ideogram.ai/api/images/direct/5lZMJEGhTrC26gANLFXtwg.png"
                            : operation && !operation.isAdmin && !operation.IsBusiness
                            ? "https://ideogram.ai/api/images/direct/co1wQyI1Qx-q7Wm2iiPuvg.png"
                            : "https://ideogram.ai/api/images/direct/Lgf0yImGRqetiFUUf67b4g.jpg"
                        }
                      alt="profile"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "10px",
                        objectFit: "cover",
                        boxShadow: "1px 1px 8px 1px black",
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <EditClient
                      theIDclient={operation._id}
                      dataClient={operation}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <DeleteClient
                      theIDclient={operation._id}
                      dataClient={operation}
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
