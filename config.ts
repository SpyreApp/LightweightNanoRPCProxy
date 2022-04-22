import type { IAPIConfig } from "./types.d.ts";

// Load the config file and set defaults
let CONFIG: string;
try {
  CONFIG = await Deno.readTextFile("/app/config/config.json");

  if (CONFIG === "") {
    CONFIG = "{}";
  }
} catch (err) {
  console.log(err)
  CONFIG = "{}";
}

export const {
  LOG_DATA = false,
  NODE_RPC = "http://127.0.0.1:7076",
  WORK_RPC = "",
  API_ROUTE = "/api",
  PORT = 8888,
  TRUST_PROXY = false,
  MAX_ACTIONS_COUNT = {},
  MAX_REQUESTED_ACCOUNTS_COUNT = {},
  AVAILABLE_ACTIONS = [
    "account_history",
    "account_info",
    "account_balance",
    "accounts_balances",
    "account_key",
    "account_representative",
    "account_weight",
    "accounts_frontiers",
    "accounts_pending",
    "active_difficulty",
    "available_supply",
    "block_account",
    "block_info",
    "block_count",
    "block_create",
    "block_confirm",
    "blocks_info",
    "chain",
    "confirmation_quorum",
    "delegators_count",
    "frontiers",
    "key_create",
    "pending",
    "pending_exists",
    "process",
    "representatives",
    "representatives_online",
    "sign",
    "successors",
    "mnano_to_raw",
    "mnano_from_raw",
    "work_validate",
    "validate_account_number",
    "version",
    "telemetry",
    "uptime",
    "republish",
  ],
  REQUESTS_LIMIT = 1000,
  REQUESTS_LIMIT_DURATION = 60 * 1000, // 1 minute
  USERS = [],
  SUPER_IPS = ["::1"],
} = JSON.parse(CONFIG) as IAPIConfig;
