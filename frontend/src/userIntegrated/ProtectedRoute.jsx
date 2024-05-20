import React from "react";
import { GeneralContext } from "../App";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  permission: PropTypes.arrayOf(PropTypes.number),
};

export default function ProtectedRoute({ children, permission }) {
  const navigate = useNavigate();
  const { userRoleType, user } = React.useContext(GeneralContext);
  const userRoleTypeNumber = Number(userRoleType);
  const userHadPermission = permission
    ? permission.includes(userRoleTypeNumber)
    : false;
  if (!userHadPermission) {
    return (
      <div
        className="titleOperationAndAgents"
        style={{ height: "200px", display: "grid" }}>
        {`Hello, ${
          user?.name?.first ? user.name.first : "Guest"
        } You seem to have arrived here by mistake, you can try again :)`}
        <ul>
          {user?.IsBusiness && (
            <li onClick={() => navigate("/operationTeams")}>
              <IconButton id="btnCreateAndPress" style={{ color: "black" }}>
                Operation Teams
              </IconButton>
            </li>
          )}
          {!user?.IsBusiness && !user?.isAdmin && user?.teamName && (
            <li onClick={() => navigate("/dailyOperation")}>
              <IconButton id="btnCreateAndPress" style={{ color: "black" }}>
                My Daily Operation
              </IconButton>
            </li>
          )}
          {user?.isAdmin && (
            <li onClick={() => navigate("/centralizedOperation")}>
              <IconButton id="btnCreateAndPress" style={{ color: "black" }}>
                Centralized Operation
              </IconButton>
            </li>
          )}
          {!user?.teamName && (
            <li onClick={() => navigate("/login")}>
              <IconButton id="btnCreateAndPress" style={{ color: "black" }}>
                Log In
              </IconButton>
            </li>
          )}
        </ul>
      </div>
    );
  } else {
    return children;
  }
}
