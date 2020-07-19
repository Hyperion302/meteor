output "vpc_id" {
  value       = google_compute_network.default.id
  description = "The ID of the VPC"
}

output "vpc_name" {
  value       = google_compute_network.default.name
  description = "Name of the VPC"
}
