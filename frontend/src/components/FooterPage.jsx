import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import "../styles/Navbar.css";

export default function FooterPage() {
  return (
    <AppBar id="myNavBarFooter" position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            {<h3>SB database by Samin⚡️ Number: 0756789012 </h3>}
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}>
            {<h3> SB database by Samin⚡️ 0756789012</h3>}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
