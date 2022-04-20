import { json, opine } from "./deps.ts";

import {
  API_ROUTE,
  AVAILABLE_ACTIONS,
  MAX_ACTIONS_COUNT,
  MAX_REQUESTED_ACCOUNTS_COUNT,
  NODE_RPC,
  PORT,
  SUPER_IPS,
  TRUST_PROXY,
  WORK_RPC,
} from "./config.ts";
import { handleRequestLog, startLogging } from "./log.ts";
// import { rateLimiter, setRateLimitHeaders } from "./rate_limit.ts";
import { clamp, getUserByToken } from "./utils.ts";
import type { RequestHandler } from "./types.d.ts";

const app = opine();

await startLogging();

const DEFAULT_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  "Content-Type": "application/json",
};

app.use(json());

if (TRUST_PROXY) {
  app.set("trust proxy", true);
}

interface IRequestBase extends Record<string, unknown> {
  action?: string;
}

const handleRPCRequest: RequestHandler = async (req, res) => {
  res.set(DEFAULT_HEADERS);

  let body: IRequestBase;
  if (req.method === "POST") {
    body = req.body;
  } else if (req.method === "GET") {
    body = req.query;
  } else {
    body = {
      action: "invalid",
    };
  }

  if (!("action" in body)) {
    res.setStatus(422);

    handleRequestLog(req, res);

    return res.json({
      message: "Action field is required",
    });
  }

  const action = body.action as string;
  const authorization_header = req.get("Authorization");

  let allowed_actions = [...AVAILABLE_ACTIONS];

  if (!SUPER_IPS.includes(req.ip)) {
    if (authorization_header) {
      let user = getUserByToken(authorization_header);

      if (user) {
        allowed_actions = allowed_actions.concat(user.extra_available_actions);
      } else {
        res.setStatus(403);

        /* LOG */ handleRequestLog(req, res);

        return res.json({
          message: "Invalid authorization token provided.",
        });
      }
    } else {
      // try {
      //   const rateLimiterRes = await rateLimiter.consume(req.ip, 1);
      //   setRateLimitHeaders(res, rateLimiterRes);
      // } catch (rateLimiterRes) {
      //   setRateLimitHeaders(res, rateLimiterRes);
      //   res.setStatus(429);
      //   /* LOG */ handleRequestLog(req, res);
      //   return res.json({
      //     message: "Too Many Requests",
      //   });
      // }
    }
  }

  if (!allowed_actions.includes(action)) {
    res.setStatus(403);
    /* LOG */ handleRequestLog(req, res);
    return res.json({
      message: "Action is not allowed",
    });
  }

  let params = Object.assign({}, body);

  // Make sure "count" param is not too high for configured actions
  if (action in MAX_ACTIONS_COUNT && !isNaN(MAX_ACTIONS_COUNT[action])) {
    const count = (params["count"] as number) || 0;

    params["count"] = clamp(count, 0, MAX_ACTIONS_COUNT[action]);
  }

  // Make sure "accounts" array does not have too high amount of accounts for configured actions
  if (
    action in MAX_REQUESTED_ACCOUNTS_COUNT &&
    !isNaN(MAX_REQUESTED_ACCOUNTS_COUNT[action])
  ) {
    const accounts = Array.isArray(params.accounts as string[])
      ? (params.accounts as string[]).slice(
        0,
        MAX_REQUESTED_ACCOUNTS_COUNT[action],
      )
      : [];

    params["accounts"] = accounts;
  }

  try {
    let rpc_response: Response;
    switch (action) {
      case "work_generate":
      case "work_validate":
      case "work_cancel": {
        rpc_response = await fetch(
          WORK_RPC && WORK_RPC !== "" ? WORK_RPC : NODE_RPC,
          {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        break;
      }

      default: {
        rpc_response = await fetch(NODE_RPC, {
          method: "POST",
          body: JSON.stringify(params),
          headers: {
            "Content-Type": "application/json",
          },
        });
        break;
      }
    }

    try {
      const body = await rpc_response.json();

      /* LOG */ handleRequestLog(req, res);

      return res.json(body);
    } catch (err) {
      res.setStatus(500);

      /* LOG */ handleRequestLog(req, res);

      return res.json({
        message: "Invalid JSON response",
      });
    }
  } catch (e) {
    res.setStatus(503);

    /* LOG */ handleRequestLog(req, res);

    return res.json({
      error: "Something wrong happened, maybe the NANO node is currently down",
    });
  }
};

if (API_ROUTE !== "/") {
  app.get("/", (_, res) => {
    return res.json({
      message: "RPC requests are supposed to be sent to " + API_ROUTE,
    });
  });
}

app.get(API_ROUTE, handleRPCRequest);
app.post(API_ROUTE, handleRPCRequest);

app.listen(PORT, () => {
  console.log(`RPC handler app listening at port ${PORT}`);
});
