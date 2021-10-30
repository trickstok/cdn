import logger from "pino";
import moment from "moment";
import chalk from "chalk";

const log = logger({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      messageFormat: `${chalk.gray("{time}")} ${chalk.white("{msg}")}`,
      ignore: "pid,hostname,filename,time",
    },
  },
  timestamp: () => `,"time":"${moment().format("HH:mm:ss")}"`,
});

export default log;
