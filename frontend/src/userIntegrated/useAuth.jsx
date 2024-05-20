import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { RoleTypes } from "../components/RoleTypes";

export const useAuth = (setUserRoleType, setLoader) => {
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserRoleType(RoleTypes.none);
        setLoader(false);
        return;
      }

      const user = jwtDecode(token);

      const currentTime = Date.now().valueOf() / 1000;
      if (user.exp < currentTime) {
        localStorage.removeItem("token");
        setUserRoleType(RoleTypes.none);
        window.location.href = "/login";
        setLoader(false);
        return;
      }

      let role = RoleTypes.user;
      if (user.isAdmin) {
        role = RoleTypes.isAdmin;
      } else if (user.IsBusiness) {
        role = RoleTypes.IsBusiness;
      }
      setUserRoleType(role);
      setLoader(false);
    };

    checkAuth();

    const intervalId = setInterval(checkAuth, 1000);
    return () => clearInterval(intervalId);
  }, []);
};



