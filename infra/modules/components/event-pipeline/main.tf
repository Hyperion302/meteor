provider "archive" {}
# Handler function
data "archive_file" "function_file" {
  type        = "zip"
  output_path = "${path.module}/source.zip"
  source {
    content  = file("${path.module}/src/index.js")
    filename = "index.js"
  }
  source {
    content  = file("${path.module}/src/package.json")
    filename = "package.json"
  }
}
resource "google_storage_bucket" "code_bucket" {
  name = "${lower(var.function_name)}-cb"
}
resource "google_storage_bucket_object" "code_archive" {
  name   = "index.zip"
  bucket = google_storage_bucket.code_bucket.name
  source = data.archive_file.function_file.output_path
}
resource "google_cloudfunctions_function" "handler_function" {
  name        = var.function_name
  description = var.function_description
  runtime     = "nodejs10"

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.code_bucket.name
  source_archive_object = google_storage_bucket_object.code_archive.name
  trigger_http          = true
  timeout               = 60
  entry_point           = "entry"

  environment_variables = {
    "PUBSUBTOPIC"      = google_pubsub_topic.pubsub_topic.name
    "TIMETOLERANCE"    = 300
    "MUXWEBHOOKSECRET" = var.webhook_secret
  }
}
# Needs to be anonymous
resource "google_cloudfunctions_function_iam_member" "anonymous_invoker" {
  project        = google_cloudfunctions_function.handler_function.project
  region         = google_cloudfunctions_function.handler_function.region
  cloud_function = google_cloudfunctions_function.handler_function.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}
# PubSub topic
resource "google_pubsub_topic" "pubsub_topic" {
  name = var.pubsub_topic_name
}
# PubSub subscription
resource "google_pubsub_subscription" "pubsub_subscription" {
  name  = var.pubsub_subscription_name
  topic = google_pubsub_topic.pubsub_topic.name

  ack_deadline_seconds       = 10
  message_retention_duration = "86400s" # 1 day

  expiration_policy {
    ttl = "" # Don't expire
  }
}

