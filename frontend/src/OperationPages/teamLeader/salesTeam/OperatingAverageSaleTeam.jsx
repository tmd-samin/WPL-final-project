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

export default function OperatingAverageSaleTeam() {
  const [operationAverageSaleTeam, setOperationAverageSaleTeam] = useState([]);
  const { snackbar } = useContext(GeneralContext);

  useEffect(() => {
    fetch(`http://localhost:4000/api/dailyOperatingAverageSaleTeam`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOperationAverageSaleTeam([data]);
        snackbar(data.message ? data.message : "The team's average sales for the day has been successfully loaded!");
      });
  }, []);

  return (
    <>
      {
        <TableContainer component={Paper} id="container">
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ס׳׳כ פעולות</StyledTableCell>
                <StyledTableCell align="right">
                  מכירות - Fiber מצטבר
                </StyledTableCell>
                <StyledTableCell align="right">
                  {" "}
                  מכירות - TV מצטבר
                </StyledTableCell>
                <StyledTableCell align="right">
                  EasyMesh - מצטבר
                </StyledTableCell>
                <StyledTableCell align="right">שדרוג - מצטבר</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {operationAverageSaleTeam[0] && (
                <StyledTableRow key={0}>
                  <StyledTableCell component="th" scope="row">
                    {Object.values(
                      operationAverageSaleTeam[0][
                        Object.keys(operationAverageSaleTeam[0])[0]
                      ]
                    ).reduce((a, b) => a + b, 0)}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {
                      operationAverageSaleTeam[0][
                        Object.keys(operationAverageSaleTeam[0])[0]
                      ].totalSellerFiber
                    }
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {
                      operationAverageSaleTeam[0][
                        Object.keys(operationAverageSaleTeam[0])[0]
                      ].totalSellerTV
                    }
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {
                      operationAverageSaleTeam[0][
                        Object.keys(operationAverageSaleTeam[0])[0]
                      ].totalEasyMesh
                    }
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {
                      operationAverageSaleTeam[0][
                        Object.keys(operationAverageSaleTeam[0])[0]
                      ].totalUpgradeProgress
                    }
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </>
  );
}
