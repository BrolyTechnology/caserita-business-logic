# ----------------------------
# Stage 1: Base - Common setup
# ----------------------------
FROM node:22-alpine3.20 AS base

# Install pnpm globally once, reused across stages
RUN npm install -g pnpm

WORKDIR /usr/src/app

# ----------------------------
# Stage 2: Builder - Build app
# ----------------------------
FROM base AS build

# Copy only dependency manifests first (better layer caching)
COPY package.json pnpm-lock.yaml ./

# Install all deps (dev + prod)
RUN pnpm install --frozen-lockfile

# Copy rest of the source code
COPY . .

# Build the app
RUN pnpm run build


# ----------------------------
# Stage 3: Deploy - Production image
# ----------------------------
FROM base AS deploy

WORKDIR /usr/src/app

# Build-time metadata (via --build-arg)
ARG BUILD_DATE
ARG VERSION
ARG COMMIT_SHA
ARG ENVIRONMENT
ARG NODE_ENV

ARG LOGGER_LEVEL
ARG LOGGER_ENABLED
ARG LOGGER_CLOUD
ARG TOKEN_LOGTAIL_LOGGER

ARG DB_HOST_POSTGRES
ARG DB_PORT_POSTGRES
ARG DB_USERNAME_POSTGRES
ARG DB_PASSWORD_POSTGRES
ARG DB_CONTAINER_NAME_POSTGRES
ARG DB_SYNCHRONIZE_POSTGRES

ARG BCRYPT_SALT_OR_ROUNDS

ARG JWT_KEY_SECRET
ARG JWT_EXPIRE_IN

# ARG THERMAL_PRINTER_HEAD_STORE_NAME
# ARG THERMAL_PRINTER_HEAD_RUC
# ARG THERMAL_PRINTER_HEAD_ADDRESS
# ARG THERMAL_PRINTER_IP_ADDRESS

ARG BASE_URL_TAX_IDENTITY_VALIDATION_API_CLIENT
ARG BASE_URL_SERVER_IOT_NETWORK_API_CLIENT

# Export args as environment variables (runtime)
ENV BUILD_DATE=${BUILD_DATE} \
    VERSION=${VERSION} \
    COMMIT_SHA=${COMMIT_SHA} \
    ENVIRONMENT=${ENVIRONMENT} \
    NODE_ENV=${NODE_ENV:-production} \
    LOGGER_LEVEL=${LOGGER_LEVEL} \
    LOGGER_ENABLED=${LOGGER_ENABLED} \
    LOGGER_CLOUD=${LOGGER_CLOUD} \
    TOKEN_LOGTAIL_LOGGER=${TOKEN_LOGTAIL_LOGGER} \
    DB_HOST_POSTGRES=${DB_HOST_POSTGRES} \
    DB_PORT_POSTGRES=${DB_PORT_POSTGRES} \
    DB_USERNAME_POSTGRES=${DB_USERNAME_POSTGRES} \
    DB_PASSWORD_POSTGRES=${DB_PASSWORD_POSTGRES} \
    DB_CONTAINER_NAME_POSTGRES=${DB_CONTAINER_NAME_POSTGRES} \
    DB_SYNCHRONIZE_POSTGRES=${DB_SYNCHRONIZE_POSTGRES} \
    BCRYPT_SALT_OR_ROUNDS=${BCRYPT_SALT_OR_ROUNDS} \
    JWT_KEY_SECRET=${JWT_KEY_SECRET} \
    JWT_EXPIRE_IN=${JWT_EXPIRE_IN} \
    # THERMAL_PRINTER_HEAD_STORE_NAME=${THERMAL_PRINTER_HEAD_STORE_NAME} \
    # THERMAL_PRINTER_HEAD_RUC=${THERMAL_PRINTER_HEAD_RUC} \
    # THERMAL_PRINTER_HEAD_ADDRESS=${THERMAL_PRINTER_HEAD_ADDRESS} \
    # THERMAL_PRINTER_IP_ADDRESS=${THERMAL_PRINTER_IP_ADDRESS} \
    BASE_URL_TAX_IDENTITY_VALIDATION_API_CLIENT=${BASE_URL_TAX_IDENTITY_VALIDATION_API_CLIENT} \
    BASE_URL_SERVER_IOT_NETWORK_API_CLIENT=${BASE_URL_SERVER_IOT_NETWORK_API_CLIENT}

# Copy dependency manifests and install only production deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile && \
    pnpm store prune && \
    rm -rf ~/.pnpm-store

# Copy built assets from builder
COPY --from=build /usr/src/app/dist ./dist
# COPY --from=build /usr/src/app/assets ./assets

# Run as non-root for better security
# USER caserita-stg

# Expose application port
# EXPOSE 3001

# Start the application
CMD ["node", "dist/src/main.js"]
