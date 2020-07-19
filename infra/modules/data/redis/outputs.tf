output "redis_host" {
  value       = google_redis_instance.redis_instance.host
  description = "IP address of created Redis instance"
}

output "redis_port" {
  value       = google_redis_instance.redis_instance.port
  description = "Port of created Redis instance"
}
