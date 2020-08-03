output "public_address" {
  description = "Public IP address to connect to in the VPC"
  value       = google_sql_database_instance.master.public_ip_address
}
output "connection_name" {
  description = "Connection name for the SQL proxy"
  value       = google_sql_database_instance.master.connection_name
}
output "application_user" {
  description = "Username for application user"
  value       = google_sql_user.application.name
}
output "application_pass" {
  description = "Password for application user"
  value       = google_sql_user.application.password
}
