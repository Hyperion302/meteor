provider "cloudflare" {
  api_token            = var.token
  api_user_service_key = var.origin_ca_key
}
provider "tls" {}

# DNS
resource "cloudflare_record" "api" {
  zone_id = var.zone_id
  name    = "api"
  value   = var.external_ip
  type    = "A"
  ttl     = 1
  proxied = true
}

resource "cloudflare_record" "root" {
  zone_id = var.zone_id
  name    = "swish.tv"
  value   = var.external_ip
  type    = "A"
  ttl     = 1
  proxied = true
}

# SSL
resource "tls_private_key" "key" {
  algorithm = "RSA"
}
resource "tls_cert_request" "cert_req" {
  key_algorithm = tls_private_key.key.algorithm
  private_key_pem = tls_private_key.key.private_key_pem

  subject {
    common_name = "swish.tv"
    organization = "JTS Inc."
  }
}
resource "cloudflare_origin_ca_certificate" "cert" {
  csr                = tls_cert_request.cert_req.cert_request_pem
  hostnames          = [ "api.swish.tv", "*.swish.tv" ]
  request_type       = "origin-rsa"
  requested_validity = 5475
}
