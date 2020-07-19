output "external_address_ip" {
  description = "IPv4 of the external address"
  value       = google_compute_global_address.external_address.address
}
