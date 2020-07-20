output "watchtime_store_address" {
  value       = "${module.watchtime_store.redis_host}:${module.watchtime_store.redis_port}"
  description = "Host and port of the watchtime store"
}
output "external_address" {
  value       = module.cluster.external_address_ip
  description = "Global IP to access cluster"
}
output "domain" {
  value       = module.edge.domain
  description = "Root DNS entry"
}
output "db_connection" {
  value       = module.database.connection_name
  description = "Connection name for the connection proxy"
}
