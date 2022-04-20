import { RateLimiterMemory } from "./deps.ts";
import type { OpineResponse, RateLimiterRes } from "./types.d.ts";
import { REQUESTS_LIMIT, REQUESTS_LIMIT_DURATION } from "./config.ts";
import type { RateLimiterMemory as RateLimiterMemoryType } from "./rate-limit.d.ts";

const RLMemory = RateLimiterMemory as unknown as RateLimiterMemoryType;

// @ts-ignore as it's a valid constructor, the types are just screwy
export const rateLimiter = new RLMemory({
  points: REQUESTS_LIMIT,
  duration: REQUESTS_LIMIT_DURATION,
});

export const setRateLimitHeaders = (
  res: OpineResponse,
  rateLimiterRes: RateLimiterRes,
) => {
  console.log(rateLimiterRes.msBeforeNext, rateLimiterRes.remainingPoints);
  res.setHeader({
    "Retry-After": (rateLimiterRes.msBeforeNext / 1000).toString(),
    "X-RateLimit-Limit": REQUESTS_LIMIT.toString(),
    "X-RateLimit-Remaining": rateLimiterRes.remainingPoints.toString(),
    "X-RateLimit-Reset": new Date(
      Date.now() + rateLimiterRes.msBeforeNext,
    ).toString(),
  });
};
