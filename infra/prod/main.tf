provider "google" {
  version     = "~> 3.29"
  region      = var.gcp_region
  project     = var.gcp_project_id
  credentials = file(var.gcp_credentials_path)
}

# TODO: Once Swish is on a Github Organization
#provider "github" {
#  token      = var.github_token
#  organization = "Swish-Media"
#}

terraform {
  backend "gcs" {
    bucket      = "swish-tf-states"
    prefix      = "prod"
    credentials = "credentials.json"
  }
}

# Auth
module "auth" {
  source = "../modules/components/auth"

  domain        = var.auth0_domain
  client_id     = var.auth0_client_id
  client_secret = var.auth0_client_secret

  resource_server_name       = var.auth0_api_name
  resource_server_identifier = var.auth0_api_identifier
  db_connection_name         = var.auth0_connection_name
  mobile_client_name         = var.auth0_mobile_name
  m_to_m_client_name         = var.auth0_m_to_m_name
  web_client_name            = var.auth0_web_name
}

# VPC
module "network" {
  source = "../modules/mngt/vpc"

  vpc_name = var.vpc
}

# Edge
module "edge" {
  source = "../modules/mngt/edge"

  token         = var.cf_token
  origin_ca_key = var.cf_origin_ca_key
  zone_id       = var.cf_zone_id
  external_ip   = module.cluster.external_address_ip
}

# Video + Icon CDN
module "cdn" {
  source = "../modules/data/cdn"

  cdn_bucket_name = var.cdn_bucket_name
}

# Watchtime store
module "watchtime_store" {
  source = "../modules/data/redis"

  redis_instance_name        = var.instance_name
  redis_instance_size        = 1
  redis_instance_network     = module.network.vpc_id
  redis_instance_region_zone = var.gcp_region_zone
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

# Cluster
#data "github_branch" "master" {
#  repository = "hyperion302/swish"
#  branch     = "master"
#}
module "cluster" {
  source = "../modules/components/kube-cluster"

  external_address_name = var.external_address_name

  cluster_name     = var.cluster_name
  cluster_location = var.gcp_region_zone
  cluster_network  = module.network.vpc_name
  cluster_subnet   = module.network.vpc_name

  node_cpus   = 1
  node_memory = 3072

  release_name       = var.helm_release
  dev_mux_id         = var.dev_mux_id
  prod_mux_id        = var.prod_mux_id
  dev_mux_secret     = var.dev_mux_secret
  prod_mux_secret    = var.prod_mux_secret
  algolia_id         = var.algolia_id
  algolia_secret     = var.algolia_secret
  main_docker_image  = "${var.gcp_project_id}/swish-main"
  main_docker_tag    = var.main_docker_tag # data.github_branch.master.sha
  ssr_docker_image   = "${var.gcp_project_id}/swish-ssr"
  ssr_docker_tag     = var.ssr_docker_tag # data.github_branch.master.sha
  tls_cert           = module.edge.certificate_pem
  tls_key            = module.edge.certificate_key
  prod_redis_address = module.watchtime_store.redis_host
  auth_jwks_uri      = module.auth.jwks_uri
  auth_jwt_audience  = module.auth.jwt_audience
  auth_jwt_issuer    = module.auth.jwt_issuer
}

