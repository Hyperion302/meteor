variable "resource_server_name" {
  description = "Name of the Auth0 resource server (API)"
  type        = string
}
variable "resource_server_identifier" {
  description = "URL (or identifier) of the API"
  type        = string
}

variable "db_connection_name" {
  description = "Name of the DB connection"
  type        = string
}

variable "mobile_client_name" {
  description = "Name of the mobile client"
  type        = string
}
variable "m_to_m_client_name" {
  description = "Name of the machine to machine client"
  type        = string
}
variable "web_client_name" {
  description = "Name of the web client"
  type        = string
}

variable "domain" {
  description = "Domain of the API connection"
  type        = string
}
variable "client_id" {
  description = "Client ID of the API connection"
  type        = string
}
variable "client_secret" {
  description = "Client secret of the API connection"
  type        = string
}
