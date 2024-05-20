import { Route, Routes } from "react-router-dom";
import Login from "./userIntegrated/Login.jsx";
import SignUp from "./userIntegrated/SignUp.jsx";
import Account from "./userIntegrated/Account.jsx";
import OperationTeams from "./OperationPages/teamLeader/operationTeam/OperationTeams.jsx";
import About from "./pages/About.jsx";
import MyOperation from "./OperationPages/agent/operation/MyOperation.jsx";
import IncrementalOperation from "./OperationPages/agent/operation/IncrementalOperation.jsx";
import SalesOperationDaily from "./OperationPages/agent/sales/SalesOperationDaily.jsx";
import SalesOperationIncremental from "./OperationPages/agent/sales/SalesOperationIncremental.jsx";
import SalesIncrementalTeams from "./OperationPages/teamLeader/salesTeam/SalesIncrementalTeams.jsx";
import IncrementalOperationTeams from "./OperationPages/teamLeader/operationTeam/IncrementalOperationTeams.jsx";
import IncrementalOperationTeamPerAgent from "./OperationPages/teamLeader/operationTeam/IncrementalOperationTeamPerAgent.jsx";
import { RoleTypes } from "./components/RoleTypes.jsx";
import ProtectedRoute from "./userIntegrated/ProtectedRoute.jsx";
import CentralizedOperation from "./OperationPages/centerManager/CentralizedOperation.jsx";
import MyAgentSupervisor from "./OperationPages/centerManager/MyAgentSupervisor.jsx";
import MyEmployeeSupervisor from "./OperationPages/centerManager/MyEmployeeSupervisor.jsx";
import MyTeamSupervisor from "./OperationPages/centerManager/MyTeamSupervisor.jsx";
import MySalesSupervisor from "./OperationPages/centerManager/MySalesSupervisor.jsx";

export default function Router(theme) {
  return (
    <Routes>
      <Route path="/about" element={<About theme={theme} />} />
      <Route path="/dailyOperation" element={
        <ProtectedRoute permission={[RoleTypes.user]}>
            <MyOperation theme={theme} />
        </ProtectedRoute>
        } />
      <Route
        path="/incrementalOperation"
        element={
            <ProtectedRoute permission={[RoleTypes.user]}>
            <IncrementalOperation theme={theme} />
            </ProtectedRoute>
        }
        />
      <Route
        path="/dailySalesOperation"
        element={
            <ProtectedRoute permission={[RoleTypes.user]}>
            <SalesOperationDaily theme={theme} />
            </ProtectedRoute>
        }
        />
      <Route
        path="/incrementalSalesOperation"
        element={
            <ProtectedRoute permission={[RoleTypes.user]}>
            <SalesOperationIncremental theme={theme} />
            </ProtectedRoute>
        }
        />
      <Route
        path="/incrementalSalesOperationTeams"
        element={
          <ProtectedRoute permission={[RoleTypes.IsBusiness]}>
            <SalesIncrementalTeams theme={theme} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/incrementalOperationTeams"
        element={
          <ProtectedRoute permission={[RoleTypes.IsBusiness]}>
            <IncrementalOperationTeams theme={theme} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/incrementalOperationTeamsPerAgent"
        element={
            <ProtectedRoute permission={[RoleTypes.IsBusiness]}>
            <IncrementalOperationTeamPerAgent theme={theme} />
            </ProtectedRoute>
        }
        />
      <Route
        path="/operationTeams"
        element={
            <ProtectedRoute permission={[RoleTypes.IsBusiness]}>
            <OperationTeams theme={theme} />
            </ProtectedRoute>
        }
      />
      <Route
        path="/centralizedOperation"
        element={
            <ProtectedRoute permission={[RoleTypes.isAdmin]}>
            <CentralizedOperation theme={theme} />
            </ProtectedRoute>
        }
      />
        <Route
            path="/myTeamSupervisor"
            element={
                <ProtectedRoute permission={[RoleTypes.isAdmin]}>
                <MyTeamSupervisor theme={theme} />
                </ProtectedRoute>
            }
        />
                <Route
            path="/myAgentSupervisor"
            element={
                <ProtectedRoute permission={[RoleTypes.isAdmin]}>
                <MyAgentSupervisor theme={theme} />
                </ProtectedRoute>
            }
        />
                <Route
            path="/mySalesSupervisor"
            element={
                <ProtectedRoute permission={[RoleTypes.isAdmin]}>
                <MySalesSupervisor theme={theme} />
                </ProtectedRoute>
            }
        />
                <Route
            path="/myEmployeeSupervisor"
            element={
                <ProtectedRoute permission={[RoleTypes.isAdmin]}>
                <MyEmployeeSupervisor theme={theme} />
                </ProtectedRoute>
            }
        />
        <Route
            path="*"
            element={
                <ProtectedRoute permission={[RoleTypes.none]}>
                <Login theme={theme} />
                </ProtectedRoute>
            }
        />
      <Route path="/login" element={<Login theme={theme} />} />
      <Route path="/SignUp" element={<SignUp theme={theme} />} />
      <Route path="/account" element={<Account theme={theme} />} />
    </Routes>
  );
}
