# Backup and Recovery

Backups are currently **simulated**.

- Admin → Backups → Run backup now creates a `BackupJob` with ZIP metadata
- Restore marks the job as restored (no real filesystem restore yet)
- Configure retention/schedules in future iterations; current API supports manual run/restore

For production, replace the simulator with real DB dumps and object-storage archives.
