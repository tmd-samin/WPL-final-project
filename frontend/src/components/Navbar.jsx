import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Button,
  Tooltip,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate, useResolvedPath } from "react-router-dom";
import "../styles/Navbar.css";
import {
  checkPermissions,
  pages,
  useGeneralContext,
  useLogout,
} from "./RoleTypes";
import { useAnchors } from "./useAnchors";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const {
    anchorElNav,
    anchorElUser,
    handleOpenNavMenu,
    handleOpenUserMenu,
    handleCloseNavMenu,
    handleCloseUserMenu,
  } = useAnchors();

  const { user, setUser, setLoader, userRoleType, setUserRoleType } =
    useGeneralContext();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    fetch(`http://localhost:4000/api/user/${userId}`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(userId);
        setUser(data);
      });
  }, []);

  const navigate = useNavigate();
  const path = useResolvedPath().pathname;
  const logout = useLogout(
    setUser,
    setUserRoleType,
    setLoader,
    navigate,
    handleCloseUserMenu
  );

  return (
    <>
      {
        <AppBar id="myNavBar" position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}>
                <b id="myNavBarBtn" style={{ fontFamily: "initial" }}>
                 Joynur/Samin⚡️
                </b>
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit">
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  keepMounted
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{ display: { xs: "block", md: "none" } }}>
                  {pages
                    .filter(
                      (p) =>
                        !p.permissions ||
                        checkPermissions(p.permissions, userRoleType)
                    )
                    .map((p) => (
                      <Link
                        key={p.route}
                        to={p.route}
                        style={{ textDecoration: "none", color: "inherit" }}>
                        <MenuItem onClick={handleCloseNavMenu}>
                          <Typography textAlign="center">{p.title}</Typography>
                        </MenuItem>
                      </Link>
                    ))}
                </Menu>
              </Box>
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}>
                <b style={{ fontFamily: "initial" }}> Joynur/Samin⚡️</b>
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages
                  .filter(
                    (p) =>
                      !p.permissions ||
                      checkPermissions(p.permissions, userRoleType)
                  )
                  .map((p) => (
                    <Link
                      key={p.route}
                      to={p.route}
                      style={{ textDecoration: "none", color: "inherit" }}>
                      <Button
                        container={undefined}
                        id="myNavBarBtn"
                        onClick={handleCloseNavMenu}
                        sx={{
                          my: 2,
                          color: "inherit",
                          textDecoration: "none",
                          display: "block",
                          backgroundColor: p.route === path ? "##7c7b7b" : "",
                          borderRadius: "30px",
                        }}>
                        {p.title}
                      </Button>
                    </Link>
                  ))}
                <h3 className="titleAgent">
                  {user && user.name
                    ? " Hello to: " + user.name.first + " " + user.name.last
                    : ""}
                  {user && user.teamName ? " Staff: " + user.teamName : ""}
                </h3>
              </Box>
              {user ? (
                <Box
                  sx={{ flexGrow: 0 }}
                  style={
                    !user.teamName ? { display: "none" } : { display: "block" }
                  }>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        id="avatarPageNav"
                        alt={`https://ideogram.ai/api/images/direct/Lgf0yImGRqetiFUUf67b4g.jpg`}
                        src={
                          user && user.isAdmin
                            ? "https://ideogram.ai/api/images/direct/IaLLA8g8Th6ud05mLTPPig.png"
                            : user && user.IsBusiness
                            ? "https://ideogram.ai/api/images/direct/5lZMJEGhTrC26gANLFXtwg.png"
                            : user && !user.isAdmin && !user.IsBusiness
                            ? "https://ideogram.ai/api/images/direct/co1wQyI1Qx-q7Wm2iiPuvg.png"
                            : "https://ideogram.ai/api/images/direct/Lgf0yImGRqetiFUUf67b4g.jpg"
                        }
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}>
                    <Link
                      to="/account"
                      style={{ textDecoration: "none", color: "inherit" }}>
                      <MenuItem onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">My Account</Typography>
                        <Typography textAlign="center"></Typography>
                      </MenuItem>
                    </Link>
                    <MenuItem onClick={logout}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                ""
              )}
            </Toolbar>
          </Container>
        </AppBar>
      }
    </>
  );
}
