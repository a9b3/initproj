#
# --- Dependencies ---
FROM node:11-alpine as dependencies

WORKDIR /app

# Cache node modules
COPY yarn.lock .
COPY package.json .
COPY .yarn-offline-mirror .yarn-offline-mirror
COPY .yarnrc .yarnrc
RUN yarn install --offline

COPY src src

#
# --- Build ---
FROM dependencies as build
COPY --from=dependencies /app .
COPY tsconfig.json .
RUN yarn run build

#
# --- Production Dependencies ---
FROM node:11-alpine as production-dependencies

WORKDIR /app

# Cache node modules
COPY yarn.lock .
COPY package.json .
COPY .yarn-offline-mirror .yarn-offline-mirror
COPY .yarnrc .yarnrc
RUN yarn install --production --offline

#
# --- Release ---
FROM node:11-alpine as release

# Use tini handle running node process as PID 1
RUN apk add --no-cache tini

COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=build /app/build ./build

EXPOSE 80
ENV NODE_PATH=./build \
    NODE_ENV=production
CMD ["/sbin/tini", "--", "node", "./build/index.js"]
