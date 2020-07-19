provider "auth0" {
  domain        = var.domain
  client_id     = var.client_id
  client_secret = var.client_secret
}
locals {
  audience = var.resource_server_identifier
}
#
# Resource server
#
resource "auth0_resource_server" "api_resource_server" {
  name        = var.resource_server_name
  identifier  = local.audience
  signing_alg = "RS256"

  allow_offline_access                            = true
  token_lifetime                                  = 86400
  token_lifetime_for_web                          = 7200
  skip_consent_for_verifiable_first_party_clients = true
}

#
# Clients
#
# Mobile (Native)
resource "auth0_client" "mobile_client" {
  name            = var.mobile_client_name
  app_type        = "native"
  is_first_party  = true
  oidc_conformant = true
  callbacks       = [ "com.jtstechnic.swish://${var.domain}/ios/com.jtstechnic.swish/callback" ]
  grant_types     = [ "implicit", "authorization_code", "refresh_token" ]
  jwt_configuration {
    alg = "RS256"
  }
}
# Test Machine (M to M)
resource "auth0_client" "m_to_m_client" {
  name            = var.m_to_m_client_name
  app_type        = "non_interactive"
  is_first_party  = true
  oidc_conformant = true
  grant_types     = [ "client_credentials" ]
  jwt_configuration {
    alg = "RS256"
  }
}
# Web (Reg Web)
resource "auth0_client" "web_client" {
  name                       = var.web_client_name
  app_type                   = "regular_web"
  is_first_party             = true
  oidc_conformant            = true
  token_endpoint_auth_method = "none"
  callbacks                  = [ "http://swish.local:8080/callback", "https://swish.tv/callback" ]
  allowed_logout_urls        = [ "http://swish.local:8080", "https://swish.tv" ]
  allowed_origins            = [ "https://swish.tv" ]
  web_origins                = [ "http://swish.local:8080", "https://swish.tv" ]
  grant_types                = [ "implicit", "authorization_code", "refresh_token" ]
  jwt_configuration {
    alg = "RS256"
  }
}

#
# Connection
#
resource "auth0_connection" "db_connection" {
  name            = var.db_connection_name
  strategy        = "auth0"
  enabled_clients = [
    auth0_client.mobile_client.id,
    auth0_client.m_to_m_client.id,
    auth0_client.web_client.id
  ]
  options {
    password_policy = "good"
  }

}

#
# Grants
#
resource "auth0_client_grant" "m_to_m_grant" {
  client_id = auth0_client.m_to_m_client.id
  audience  = auth0_resource_server.api_resource_server.identifier
  scope     = []
}
