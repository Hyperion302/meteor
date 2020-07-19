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

