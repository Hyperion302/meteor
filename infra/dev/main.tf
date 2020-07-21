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

# Main DB
module "database" {
  source = "../modules/data/sql"

  instance_name_prefix = var.sql_instance_name
  instance_region      = var.gcp_region
  instance_tier        = var.sql_instance_tier
}

# Video + Icon CDN
module "cdn" {
  source = "../modules/data/cdn"

  cdn_bucket_name = var.cdn_bucket_name
}

# Event pipeline
module "event_pipeline" {
  source = "../modules/components/event-pipeline"

  function_name            = var.handler_function
  function_description     = var.handler_function_description
  pubsub_topic_name        = var.pubsub_topic
  pubsub_subscription_name = var.pubsub_subscription
  webhook_secret           = var.mux_webhook_secret
}
