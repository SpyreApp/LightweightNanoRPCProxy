# LightweightNanoRPCProxy

This is a web server that acts as a middleman between the user and the actual
NANO node in order to limit the allowed RPC actions and adds rate limit and
basic logging.

## Setup

Rename config.example.json to config.json and change values accordingly.

Then run:

```
npm install
```

```
node app.js
```

## Configurable options

- `LOG_DATA`: Logs the returned HTTP statuses that each user received and
  first/last request date.
- `TRUST_PROXY`: Enable this if you're behind a reverse proxy like nginx &
  cloudflare.
- `NODE_RPC`: Node RPC url.
- `API_ROUTE`: Customize target api route.
- `PORT`: Port this proxy web server will run.
- `AVAILABLE_ACTIONS`: Array of allowed RPC actions.
- `REQUESTS_LIMIT`: Amount of requests each IP is allowed to make per hour.
- `USERS`: Array of users.
  - `username`: Just an alias, not actually used (yet?)
  - `token`: Randomly generated token that is supposed to be sent in the
    Authorization header (eg: `Authorization: random_string_here`)
  - `extra_available_actions`: You can add extra actions that this user can run.
  - **NOTE: All authorized users bypass the rate limiter completely.**
- `SUPER_IPS`: Array of IPs that will not use the rate limiter.
- `MAX_ACTIONS_COUNT`: Limit the value of the "count" parameter for selected
  actions
- `MAX_REQUESTED_ACCOUNTS_COUNT`: Limit the amount of the "accounts" array for
  selected actions

## Extra

You can run `node preview_logs.js` if you want to view the logs.
