output "domain" {
  description = "Root domain of the app"
  value       = cloudflare_record.root.hostname
}
output "certificate_key" {
  description = "Private key of the origin certificate"
  value       = tls_private_key.key.private_key_pem
}
output "certificate_pem" {
  description = "Public certificate of the origin certificate"
  value       = cloudflare_origin_ca_certificate.cert.certificate
}
