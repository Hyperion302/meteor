variable "function_name" {
  description = "URL safe name for the handler function"
  type        = string
}
variable "function_description" {
  description = "Human friendly description of the handler function"
  type        = string
}
variable "pubsub_topic_name" {
  description = "URL safe name for the event pipeline's PubSub topic"
  type        = string
}
variable "pubsub_subscription_name" {
  description = "URL safe name for event pipeline's PubSub subscription"
  type        = string
}
variable "webhook_secret" {
  description = "Mux-provided webhook secret"
  type        = string
}
