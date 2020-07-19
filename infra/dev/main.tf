provider "google" {
  version     = "~> 3.29"
  region      = var.gcp_region
  project     = var.gcp_project_id
  credentials = file(var.gcp_credentials_path)
}

terraform {
  backend "gcs" {
    bucket      = "swish-tf-states"
    prefix      = "dev"
    credentials = "credentials.json"
  }
}

# Video + Icon CDN

module "cdn" {
  source = "../modules/data/cdn"

  cdn_bucket_name = var.cdn_bucket_name
}

# Event pipeline
module "event_pipeline" {
  source = "../modules/components/event-pipeline"

  function_name            = "dev-muxWebhookPortal"
  function_description     = "Authentication and queueing for Mux webhook messages"
  pubsub_topic_name        = "dev-mux-events"
  pubsub_subscription_name = "dev-swish-api"
  webhook_secret           = var.mux_webhook_secret
}
