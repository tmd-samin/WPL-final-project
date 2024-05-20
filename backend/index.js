import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chalk from "chalk";
import morgan from "morgan";
import moment from "moment";
import login from "./handlers/users/login.js";
import signup from "./handlers/users/signup.js";
import myAccount from "./handlers/users/account.js";
import postOperations from "./handlers/operation/postOperations.js";
import deleteOperations from "./handlers/operation/deleteOperations.js";
import users from "./handlers/users/models/users.js";
import initialDataStart from "./initial-data/initial-data.service.js";
import logout from "./handlers/users/logout.js";
import cron from "node-cron";
import { DailyOperation } from "./handlers/operation/schemasOperations&Sales/operations.model.js";
import { DailyOperationSale } from "./handlers/operation/schemasOperations&Sales/operationSale.model.js";
import getOperationAgent from "./handlers/operation/getAgent/getOperationAgent.js";
import getSaleAgent from "./handlers/operation/getAgent/getSaleAgent.js";
import getSaleTeamLeader from "./handlers/operation/getTeamLeader/getSaleTeamLeader.js";
import gerOperationTeamLeader from "./handlers/operation/getTeamLeader/getOperationTeamLeader.js";
import putOperationAgent_Leader from "./handlers/operation/putAgent_Leader/putOperationAgent_Leader.js";
import putSaleAgent_Leader from "./handlers/operation/putAgent_Leader/putSaleAgent_Leader.js";
import gerOperationCenterManger from "./handlers/operation/getCenterManager/gerOperationCenterManger.js";
import getSaleCenterManger from "./handlers/operation/getCenterManager/getSaleCenterManger.js";
import avg_for_team from "./handlers/operation/getCenterManager/avg_for_team.js";
import { format } from "date-fns";
import fs from "fs";
import LoggersErrors from "./Loggers/LoggersErrors.js";

// Connect to MongoDB //
async function main() {
  await mongoose.connect(process.env.REMOTE_URL);
  console.log(chalk.bgYellowBright("MongoDB Connected on port 27017"));
}

main().catch((err) => console.log(err));

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: "GET,PUT,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Accept, Authorization",
  })
);
// Log the requests //
app.use(LoggersErrors);

// Start the server //
app.listen(4000, () => {
  console.log(chalk.italic.bgCyan("Server is running on port 4000"));
});
// Serve the static files //
app.use(express.static("public"));

// Log the requests to the terminal //
morgan.token("time", () => moment().format("YYYY-MM-DD HH:mm:ss"));
const morganFormat = ":time :method :url :status :response-time ms";
app.use(morgan(chalk.bgMagenta(morganFormat)));


  await DailyOperation.deleteMany({});
  await DailyOperationSale.deleteMany({});
  console.log(
    chalk.bgRedBright("Daily Operation collection and Sale has been deleted")
  );

login(app);
signup(app);
myAccount(app);

getOperationAgent(app);
gerOperationTeamLeader(app);
gerOperationCenterManger(app);

getSaleAgent(app);
getSaleTeamLeader(app);
getSaleCenterManger(app);
avg_for_team(app);
postOperations(app);

putOperationAgent_Leader(app);
putSaleAgent_Leader(app);

deleteOperations(app);

users(app);
initialDataStart(app);
logout(app);

app.use((req, res) => {
  res.status(404).json({ message: "Sorry, page not found 404" });
});
