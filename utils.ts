import { USERS } from "./config.ts";

export function clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(number, max));
}

/**
 * Returns user object if token is valid, returns undefined if invalid token is provided
 */
export function getUserByToken(token: string) {
  if (token.startsWith('Bearer ')) {
    token = token.substring(7);
  }
  return USERS.find((user) => user.token == token);
}
