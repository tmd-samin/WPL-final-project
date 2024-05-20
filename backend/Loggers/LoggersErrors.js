import moment from "moment";
import fs from "fs";
import { format } from "date-fns";

const LoggersErrors = async (req, res, next) => {
  const fileName = `./logs/log_${moment().format("Y_M_D")}.txt`;
  let responseBody;

  const oldJson = res.json;

  res.json = function (data) {
    responseBody = data;
    oldJson.apply(res, arguments);
  };

  res.on("finish", async () => {
    if (res.statusCode >= 400) {
      let content = "";

      content += `Time: ${format(new Date(), "dd-MM-yyyy HH:mm:ss")}\n`;
      content += `Method: ${req.method}\n`;
      content += `Route: ${req.url}\n`;
      content += `Status: ${res.statusCode}\n`;
      content += `Response: ${JSON.stringify(responseBody)}\n`;

      content += "\n";

      fs.appendFile(fileName, content, (err) => {});
    }
  });

  next();
};

export default LoggersErrors;
