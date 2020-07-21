output "public_address" {
  description = "Public IP address to connect to in the VPC"
  value       = google_sql_database_instance.master.public_ip_address
}
output "connection_name" {
  description = "Connection name for the SQL proxy"
  value       = google_sql_database_instance.master.connection_name
}
