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
import { GeneralContext } from "../../App";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import EditSales from "../../Agent/SalesProcess/editSale/EditSales";
import MySalesSupervisorAverage from "./MySalesSupervisorAverage";

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

export default function MySalesSupervisor() {
  const [seller, setSeller] = useState([]);

  const [selectedMonthSales, setSelectedMonthSales] = useState(
    moment().format("MM/YYYY")
  );
  const [months, setMonths] = useState([]);

  const [selectedAgent, setSelectedAgent] = useState("");
  const [agents, setAgents] = useState([]);

  const [selectedTeam, setSelectedTeam] = useState("");
  const [teams, setTeams] = useState([]);

  const { snackbar } = useContext(GeneralContext);

  useEffect(() => {
    const token = localStorage.token;
    if (!token) {
      window.location.href = "/login";
    }
    fetch(`http://localhost:4000/api/incrementalOperationSaleCenterManger`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        snackbar(
          data.message ? data.message : "The cumulative month's sales have been loaded successfully!"
        );
        if (data.message) {
          return;
        }
        const uniqueMonths = [
          ...new Set(
            data.map((seller) => moment(seller.createTime).format("MM/YYYY"))
          ),
        ];
        setMonths(uniqueMonths);
        setTeams([...new Set(data.map((operation) => operation.teamName))]);
        setAgents([...new Set(data.map((operation) => operation.nameAgent))]);
        setSeller(data);
      });
  }, []);

  const handleMonthChange = (event) => {
    setSelectedMonthSales(event.target.value);
  };

  const handleAgentChange = (event) => {
    setSelectedAgent(event.target.value);
  };

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const filterOperationSales = seller.filter((operation) => {
    const operationMonth = moment(operation.createTime).format("MM/YYYY");
    return (
      operation.nameAgent === selectedAgent &&
      operationMonth === selectedMonthSales &&
      operation.teamName === selectedTeam
    );
  });

  return (
    <>
      {!seller.length ? (
        <div className="titleOperationAndAgents">
          <h3>{`  There are still no sales for the current month at Moked`}</h3>
        </div>
      ) : (
        <>
          <div className="titleOperationAndAgents">
            <h3>{`Team sales operation: ${moment(
              selectedMonthSales,
              "MM/YYYY"
            ).format("MM/YYYY")}`}</h3>
            <FormControl
              variant="standard"
              sx={{ m: 1, minWidth: 120 }}
              style={{ marginTop: "-5px" }}>
              <InputLabel id="demo-simple-select-standard-label">
              Team selection
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedTeam}
                onChange={handleTeamChange}
                label="team selection">
                <MenuItem value={selectedTeam}>
                <em>aggregated teams</em>
                </MenuItem>
                {teams.map((team) => (
                  <MenuItem key={team} value={team}>
                    {team}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              variant="standard"
              sx={{ m: 1, minWidth: 120 }}
              style={{ marginTop: "-5px" }}>
              <InputLabel id="demo-simple-select-standard-label">
              Choosing an agent
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedAgent}
                onChange={handleAgentChange}
                label="choosing an agent">
                <MenuItem value={selectedAgent}>
                <em>aggregate agents</em>
                </MenuItem>
                {agents.map((agent) => (
                  <MenuItem key={agent} value={agent}>
                    {agent}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              variant="standard"
              sx={{ m: 1, minWidth: 120 }}
              style={{ marginTop: "-5px" }}>
              <InputLabel id="demo-simple-select-standard-label">
                Choose a month
              </InputLabel>

              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedMonthSales}
                onChange={handleMonthChange}
                label="בחירת חודש">
                <MenuItem value={selectedMonthSales}>
                <em>cumulative months</em>
                </MenuItem>
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {!filterOperationSales.length ? (
            <div className="titleOperationAndAgents">
              <h3>{`There are no sales for the team or agent for the current month`}</h3>
            </div>
          ) : (
            <>
              {
                <TableContainer
                  component={Paper}
                  id="container"
                  style={{ maxHeight: "500px", overflowY: "scroll" }}>
                  <Table
                    sx={{ minWidth: 700 }}
                    stickyHeader
                    aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                      <StyledTableCell>Execution Date</StyledTableCell>
                      <StyledTableCell>Team Name</StyledTableCell>
                      <StyledTableCell>Representative Name</StyledTableCell>
                      <StyledTableCell align="right">Customer Code</StyledTableCell>
                      <StyledTableCell align="right">Sales - Fiber</StyledTableCell>
                      <StyledTableCell align="right">Sales - TV</StyledTableCell>
                      <StyledTableCell align="right">EasyMesh</StyledTableCell>
                      <StyledTableCell align="right">Upgrade</StyledTableCell>
                      <StyledTableCell align="right">Cumulative Actions</StyledTableCell>
                      <StyledTableCell align="right">Update Sale</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(filterOperationSales) &&
                        filterOperationSales.map((seller, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">
                              {moment(seller.createTime).format("DD/MM/YYYY")}
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              {seller.teamName}
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              {seller.nameAgent}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {seller.customerCode}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {seller.sellerFiber}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {seller.sellerTV}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {seller.easyMesh}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {seller.upgradeProgress}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {seller.sellerFiber +
                                seller.sellerTV +
                                seller.easyMesh +
                                seller.upgradeProgress}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              <EditSales
                                theIDoperationSale={seller.bizNumber}
                                dataOperationSale={seller}
                              />
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              }
              <div className="titleOperationAndAgents">
                <h3
                  style={{
                    fontSize: "20px",
                  }}>{`The total performance${selectedAgent} החודש . `}</h3>
              </div>
              <MySalesSupervisorAverage
                selectedMonthSales={selectedMonthSales}
                setSelectedMonthSales={setSelectedMonthSales}
                selectedAgent={selectedAgent}
                setSelectedAgent={setSelectedAgent}
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
