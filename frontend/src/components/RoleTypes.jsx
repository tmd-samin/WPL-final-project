import { useContext } from "react";
import { GeneralContext } from "../App";

export const useGeneralContext = () => {
  const { user, setUser, setLoader, userRoleType, setUserRoleType } =
    useContext(GeneralContext);
  return { user, setUser, setLoader, userRoleType, setUserRoleType };
};
export const RoleTypes = {
  none: 0,
  user: 1,
  IsBusiness: 2,
  isAdmin: 3,
};

export const checkPermissions = (permissions, userRoleType) => {
  return permissions.includes(userRoleType);
};

export const pages = [
  { route: "/login", title: "Login", permissions: [RoleTypes.none] },
  { route: "/SignUp", title: "Sign Up", permissions: [RoleTypes.none] },
  {
    route: "/dailyOperation",
    title: "Daily Operation",
    permissions: [RoleTypes.user],
  },
  {
    route: "/dailySalesOperation",
    title: "Daily Sales",
    permissions: [RoleTypes.user],
  },
  {
    route: "/incrementalOperation",
    title: "Incremental Operation",
    permissions: [RoleTypes.user],
  },
  {
    route: "/incrementalSalesOperation",
    title: "Incremental Sales",
    permissions: [RoleTypes.user],
  },
  {
    route: "/operationTeams",
    title: "Operation Teams",
    permissions: [RoleTypes.IsBusiness],
  },
  {
    route: "/incrementalSalesOperationTeams",
    title: "Sales Teams",
    permissions: [RoleTypes.IsBusiness],
  },
  {
    route: "/incrementalOperationTeams",
    title: "Incremental Operation Teams",
    permissions: [RoleTypes.IsBusiness],
  },
  {
    route: "/incrementalOperationTeamsPerAgent",
    title: "Incremental Operation per Agent",
    permissions: [RoleTypes.IsBusiness],
  },
  {
    route: "/centralizedOperation",
    title: "Centralized Operation",
    permissions: [RoleTypes.isAdmin],
  },
  {
    route: "/myTeamSupervisor",
    title: "Team Supervisor",
    permissions: [RoleTypes.isAdmin],
  },
  {
    route: "/myAgentSupervisor",
    title: "Agent Supervisor",
    permissions: [RoleTypes.isAdmin],
  },
  {
    route: "/mySalesSupervisor",
    title: "Sales Supervisor",
    permissions: [RoleTypes.isAdmin],
  },
  {
    route: "/myEmployeeSupervisor",
    title: "Employee Management",
    permissions: [RoleTypes.isAdmin],
  },
  { route: "/about", title: "About" },
];

export const useLogout = (
  setUser,
  setUserRoleType,
  setLoader,
  navigate,
  handleCloseUserMenu
) => {
  const logout = () => {
    setLoader(true);
    setUser();
    setUserRoleType(RoleTypes.none);
    setLoader(false);
    localStorage.removeItem("token");
    navigate("./login");
    handleCloseUserMenu();
  };
  return logout;
};
