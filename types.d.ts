export type {
  OpineRequest,
  OpineResponse,
  RequestHandler,
} from "https://deno.land/x/opine@2.1.5/mod.ts";
export type { RateLimiterRes } from "https://cdn.skypack.dev/rate-limiter-flexible?dts";

export interface IAPIUser {
  username: string;
  token: string;
  extra_available_actions: string[];
}

export interface IAPIConfig {
  LOG_DATA: boolean;
  NODE_RPC: string;
  WORK_API: string;
  WORK_RPC: string;
  API_ROUTE: string;
  PORT: number;
  TRUST_PROXY: boolean;
  MAX_ACTIONS_COUNT: Record<string, number>;
  MAX_REQUESTED_ACCOUNTS_COUNT: Record<string, number>;
  AVAILABLE_ACTIONS: string[];
  REQUESTS_LIMIT: number;
  REQUESTS_LIMIT_DURATION: number;
  USERS: IAPIUser[];
  SUPER_IPS: string[];
}
