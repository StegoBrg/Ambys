# ---------------------------------
# 1️⃣ Build Stage for Frontend
# ---------------------------------
FROM node:lts-alpine AS frontend-build
WORKDIR /app

# Copy package.json and install dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy source and build
COPY frontend/ ./
RUN npm run build

# ---------------------------------
# 2️⃣ Build Stage for .NET API
# ---------------------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS api-build
WORKDIR /app

# Copy and restore dependencies
COPY ["api/HealthJournal-API/Healthy-API.csproj", "api/HealthJournal-API/"]
RUN dotnet restore "api/HealthJournal-API/Healthy-API.csproj"

# Copy remaining API source and build
COPY api/ ./api/
WORKDIR /app/api
RUN dotnet publish -c Release -o /app/published

# ---------------------------------
# 3️⃣ Final Stage - Production Image
# ---------------------------------
FROM ubuntu:latest
WORKDIR /app

# Install necessary dependencies
RUN apt update && apt install -y nginx cron postgresql-client curl && \
    apt install -y dotnet-sdk-8.0 && rm -rf /var/lib/apt/lists/*

# Copy API from build stage
COPY --from=api-build /app/published /app/api

# Copy Frontend from build stage
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# Copy and set up Nginx config
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Copy backup scripts
COPY backup/pg_backup_rotated.sh /app/backup/pg_backup_rotated.sh
COPY backup/pg_backup.config /app/backup/pg_backup.config
RUN chmod +x /app/backup/pg_backup_rotated.sh

# Copy and set up cron job for backups
COPY backup/crontab /etc/cron.d/backup-cron
RUN chmod 0644 /etc/cron.d/backup-cron && crontab /etc/cron.d/backup-cron

# Copy startup script
COPY docker/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose necessary ports (Frontend & API)
EXPOSE 80 8080

# Set default command to run startup script
CMD ["/bin/bash", "/app/start.sh"]
