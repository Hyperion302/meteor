# External Address
variable "external_address_name" {
  description = "RFC1035 name for the external address"
  type        = string
}
# Cluster
variable "cluster_name" {
  description = "RFC1035 name for the cluster"
  type        = string
}
variable "cluster_location" {
  description = "Zone or region for the cluster"
  type        = string
}
variable "cluster_network" {
  description = "VPC network (self-link or name) for the cluster"
  type        = string
}
variable "cluster_subnet" {
  description = "VPC subnet (self-link or name) for the cluster.  Must be compatible with the location"
  type        = string
}
variable "node_cpus" {
  description = "# of CPUs on node"
  type        = number
  default     = 1
}
variable "node_memory" {
  description = "Memory (MB) on node, must be divisble by 256 MB"
  type        = number
  default     = 1024
}
variable "node_scopes" {
  description = "Additional OAuth scopes"
  type        = list(string)
  default     = []
}
# Helm Release
variable "release_name" {
  description = "Name for the Helm release"
  type        = string
  default     = "swishdepl"
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
variable "tls_cert" {
  description = "TLS certificate"
  type        = string
}
variable "tls_key" {
  description = "TLS key"
  type        = string
}
variable "main_docker_tag" {
  description = "Tag for the main service image"
  type        = string
  default     = "latest"
}
variable "main_docker_image" {
  description = "Name of the main service image"
  type        = string
  default     = "swish-main"
}
variable "main_docker_repo" {
  description = "Repo for the main service image"
  type        = string
  default     = "gcr.io"
}
variable "ssr_docker_tag" {
  description = "Tag for the SSR service image"
  type        = string
  default     = "latest"
}
variable "ssr_docker_image" {
  description = "Name of the SSR service image"
  type        = string
  default     = "swish-ssr"
}
variable "ssr_docker_repo" {
  description = "Repo for the SSR service image"
  type        = string
  default     = "gcr.io"
}
variable "prod_redis_address" {
  description = "Address for the Redis instance in prod"
  type        = string
}
variable "dev_redis_address" {
  description = "Address for the Redis instance in dev"
  type        = string
  default     = "localhost"
}
