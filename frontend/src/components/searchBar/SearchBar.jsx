import { useState } from "react";
import "../../styles/operation.css";
import IconButton from "@mui/material/IconButton";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { SearchBarProp } from "./SearchBarProp";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearchResults([]);
    fetch(`http://localhost:4000/api/agent/search?name=${search}`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.error) {
          setError(data.error);
        } else {
          setSearchResults(data);
          handleOpen();
        }
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  };

  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent);
  };

  return (
    <div>
      <form onSubmit={handleSearch} style={{display:"flex"}}>
          <TextField
                  inputProps={{ style: {width:"150px"}}}
                  autoComplete="off"
                  type="text"
                  value={search}
                    size="small"
                    label="search works"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={(e) => setSearch(e.target.value)}
                  />

        <IconButton type="submit" style={{ width: "auto" }} onClick={handleOpen}>
          <ManageSearchIcon />
        </IconButton>
      </form>
      <Box>
        <SearchBarProp
          open={open}
          handleClose={handleClose}
          searchResults={searchResults}
          error={error}
          loading={loading}
          handleSelectAgent={handleSelectAgent}
          selectedAgent={selectedAgent}
          searchTerm={search}
        />
      </Box>
    </div>
  );
}


