FROM postgres:17-alpine3.20

# Install cron and additional tools.
RUN apk add --no-cache bash curl busybox-extras

# Create backup script dir.
WORKDIR /backup

# Copy backup script and config file.
COPY pg_backup_rotated.sh .
COPY pg_backup.config .

# Make script executable.
RUN chmod +x pg_backup_rotated.sh

# Copy cronjob.
COPY crontab /etc/crontabs/root

# Start cronjob.
CMD ["crond", "-f"]
