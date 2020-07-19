output "jwks_uri" {
  description = "Helper to generate JWKS URI"
  value       = "https://${var.domain}/.well-known/jwks.json"
}
output "jwt_audience" {
  description = "JWT audience for the API"
  value       = local.audience
}
output "jwt_issuer" {
  description = "JWT issue for the API"
  value       = "https://${var.domain}"
}
