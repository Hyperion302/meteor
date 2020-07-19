output "pubsub_subscription_name" {
  description = "Name of the PubSub subscription where events should be pulled from"
  value       = google_pubsub_subscription.pubsub_subscription.name
}
output "function_trigger_url" {
  description = "URL to trigger the HTTP function"
  value       = google_cloudfunctions_function.handler_function.https_trigger_url
}
