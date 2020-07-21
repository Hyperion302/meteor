# GCP Setup
variable "gcp_region" {
  default = "us-central1"
}

variable "gcp_region_zone" {
  default = "us-central1-a"
}

variable "gcp_project_id" {
  description = "Project ID of GCP project"
  default = "meteor-247517"
}

variable "gcp_credentials_path" {
  description = "Path to SA credentials"
  default = "credentials.json"
}

# Database
variable "sql_instance_name" {
  description = "Name for the SQL instance"
  type        = string
}
variable "sql_instance_tier" {
  description = "Instance tier of the SQL instance"
  type        = string
}

# CDN
variable "cdn_bucket_name" {
  description = "Name of the bucket where videos and icons are stored"
  default     = "dev-swish"
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

