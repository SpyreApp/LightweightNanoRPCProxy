import { LOG_DATA } from "./config.ts";
import type { OpineRequest, OpineResponse } from "./types.d.ts";

// Handle logging
let STATS_FILE: string;
// try {
//   STATS_FILE = await Deno.readTextFile("./logs.json");

//   if (STATS_FILE === "") {
//     STATS_FILE = "{}";
//   }
// } catch (_) {
  STATS_FILE = "{}";
// }
export const STATS =  {}

export const startLogging = () => {
  // if (LOG_DATA) {
  //   // Save logs every 1 minute
  //   setInterval(async () => {
  //     await Deno.writeTextFile(
  //       "./logs.json",
  //       JSON.stringify(STATS, null, "\t"),
  //     );
  //   }, 60 * 1000);
  // }
};

export const handleRequestLog = (req: OpineRequest, res: OpineResponse) => {
  console.log(`${req.method} ${req.url} | ${res.status}`);
  // if (!res.status || !LOG_DATA) return;

  // if (req.ip in STATS) {
  //   if ((res.status as number) in STATS[req.ip]) {
  //     STATS[req.ip][res.status] = STATS[req.ip][res.status] + 1;
  //   } else {
  //     STATS[req.ip][res.status] = 1;
  //   }

  //   STATS[req.ip].lastRequest = Date.now();
  // } else {
  //   STATS[req.ip] = {
  //     [res.status]: 1,
  //     firstRequest: Date.now(),
  //     lastRequest: Date.now(),
  //   };
  // }
};
