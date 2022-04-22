FROM denoland/deno:1.20.6

WORKDIR /config

COPY config/config.example.json ./config.json

WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY deps.ts .
COPY types.d.ts .
RUN deno cache deps.ts
RUN deno cache types.d.ts

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache index.ts

CMD ["run", "--allow-net", "--allow-read", "--allow-write", "index.ts"]