# GCP Setup
variable "gcp_region" {
  description = "GCP region"
  type        = string
}
variable "gcp_region_zone" {
  description = "GCP region and zone"
  type        = string
}
variable "gcp_project_id" {
  description = "Project ID of GCP project"
  type        = string
}
variable "gcp_credentials_path" {
  description = "Path to SA credentials"
  type        = string
}

# Github Setup
#variable "github_token" {
#  description = "Github Token"
#  type        = string
#}
#
# Auth0 Setup
variable "auth0_domain" {
  description = "Auth0 tenant domain"
  type        = string
}
variable "auth0_client_id" {
  description = "Auth0 client ID"
  type        = string
}
variable "auth0_client_secret" {
  description = "Auth0 client secret"
  type        = string
}
variable "auth0_api_name" {
  description = "Human readable name for the API"
  type        = string
}
variable "auth0_api_identifier" {
  description = "Audience identifier for the API"
  type        = string
}
variable "auth0_connection_name" {
  description = "Human readable connection name"
  type        = string
}
variable "auth0_mobile_name" {
  description = "Human readable name for the mobile client"
  type        = string
}
variable "auth0_m_to_m_name" {
  description = "Human readable name for the machine-to-machine client"
  type        = string
}
variable "auth0_web_name" {
  description = "Human readable name for the web client"
  type        = string
}

# Network
variable "vpc" {
  description = "Name for the VPC"
  type        = string
}

# Edge
variable "cf_token" {
  description = "Cloudflare API token"
  type        = string
}
variable "cf_zone_id" {
  description = "Cloudflare zone ID"
  type        = string
}
variable "cf_origin_ca_key" {
  description = "Cloudflare origin CA key"
  type        = string
}

# CDN
variable "cdn_bucket_name" {
  description = "Name of the bucket where videos and icons are stored"
  type        = string
}

# Watchtime
variable "redis_instance_name" {
  description = "Name of the Redis instance"
  type        = string
}

# Database
variable "sql_instance_tier" {
  description = "Instance tier of the SQL instance"
  type        = string
}
variable "sql_instance_size" {
  description = "Instance size"
  type        = string
}

# Event pipeline
variable "mux_webhook_secret" {
  description = "Mux-provided webhook secret"
  type        = string
}
variable "handler_function" {
  description = "Name of the mux handler function"
  type        = string
}
variable "handler_function_description" {
  description = "Human friendly name for the handler function"
  type        = string
}
variable "pubsub_topic" {
  description = "Name of the pubsub topic for the mux pipeline"
  type        = string
}
variable "pubsub_subscription" {
  description = "Name of the pubsub subscription for the mux pipeline"
  type        = string
}
# Cluster
variable "helm_release" {
  description = "URL-friendly name for the Helm release"
  type        = string
}
variable "cluster_name" {
  description = "Name for the cluster"
  type        = string
}
variable "external_address_name" {
  description = "Name for the external address"
  type        = string
}
variable "dev_mux_id" {
  description = "Development Mux ID"
  type        = string
}
variable "prod_mux_id" {
  description = "Production Mux ID"
  type        = string
}
variable "dev_mux_secret" {
  description = "Development Mux secret"
  type        = string
}
variable "prod_mux_secret" {
  description = "Production Mux secret"
  type        = string
}
variable "algolia_id" {
  description = "Algolia ID"
  type        = string
}
variable "algolia_secret" {
  description = "Algolia secret"
  type        = string
}
variable "main_docker_tag" {
  description = "Tag for the main service image"
  type        = string
}
variable "ssr_docker_tag" {
  description = "Tag for the SSR service image"
  type        = string
}
