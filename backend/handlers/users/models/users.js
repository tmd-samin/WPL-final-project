import { adminGuard } from "../../../guards.js";
import { guard } from "../../../guards.js";
import bcrypt from "bcrypt";
import { User } from "./user.model.js";
import { getLoggedUserId } from "../../../config/config.js";
import { IncrementalOperation } from "../../operation/schemasOperations&Sales/operations.model.js";
import { IncrementalOperationSale } from "../../operation/schemasOperations&Sales/operationSale.model.js";
import { DailyOperation } from "../../operation/schemasOperations&Sales/operations.model.js";
import { DailyOperationSale } from "../../operation/schemasOperations&Sales/operationSale.model.js";


const users = (app) => {
  // get all users for admin users //
app.get("/api/users", adminGuard, async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


app.get("/api/agent/search", async (req, res) => {
  const { name, bizNumber, teamName, phone, email } = req.query;

  try {
    const query = {
      $or: [
        { 'name.first': name },
        { 'name.last': name },
        { bizNumber: bizNumber },
        { teamName: teamName },
        { phone: phone },
        { email: email },
      ],
    };

    const agents = await User.find(query);
    if (agents.length === 0) {
      res.status(404).json({ message: "No found items" });
    } else {
      res.json(agents);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get("/api/agent/searchOperation", async (req, res) => {
  const {
    nameAgent,
    teamName,
    numberCalls,
    productivity,
    tvDisconnection,
    fiberDisconnection,
    simurFiber,
    simurTV,
    sellerFiber,
    sellerTV,
    easyMesh,
    upgradeProgress,
    satisfaction,
    targets,
    bizNumber,
    createTime,
  } = req.query;

  try {
    const query = {
      $or: [
        { nameAgent: { $regex: new RegExp(nameAgent, "i") } },
        { teamName: teamName },
        { numberCalls: numberCalls },
        { productivity: productivity },
        { tvDisconnection: tvDisconnection },
        { fiberDisconnection: fiberDisconnection },
        { simurFiber: { $regex: new RegExp(simurFiber, "i") } },
        { simurTV: { $regex: new RegExp(simurTV, "i") } },
        { sellerFiber: sellerFiber},
        { sellerTV: sellerTV },
        { easyMesh: easyMesh },
        { upgradeProgress: upgradeProgress },
        { satisfaction: satisfaction },
        { targets: targets },
        { bizNumber: bizNumber },
        { createTime: createTime },
      ],
    };

    const operationFind = await IncrementalOperation.find(query);
    if (operationFind.length === 0) {
      res.status(404).json({ message: "No found items" });
    } else {
      res.json(operationFind);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


  // get the user logged for user and admin users //
app.get("/api/user/:id", guard, adminGuard, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const { userId } = getLoggedUserId(req, res);

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// delete the user for admin users //
app.delete("/api/user/:id", adminGuard, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await IncrementalOperation.deleteMany({ user_id: req.params.id });
    await IncrementalOperationSale.deleteMany({ user_id: req.params.id });
    await DailyOperation.deleteMany({ user_id: req.params.id });
    await DailyOperationSale.deleteMany({ user_id: req.params.id });

    res.send("User and associated operations and sales deleted successfully " + user.name.first);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
};

export default users;








