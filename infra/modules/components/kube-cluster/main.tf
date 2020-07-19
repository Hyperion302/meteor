# External IP
resource "google_compute_global_address" "external_address" {
  name = var.external_address_name
}
# Cluster
resource "google_container_cluster" "primary" {
  name                     = var.cluster_name
  location                 = var.cluster_location
  remove_default_node_pool = true
  initial_node_count       = 1

  network           = var.cluster_network
  subnetwork        = var.cluster_subnet
  ip_allocation_policy {
    cluster_ipv4_cidr_block  = "" # Default is /16
    services_ipv4_cidr_block = "" # Default is /20
  }

  addons_config {
    horizontal_pod_autoscaling {
      disabled = true
    }
  }
}
resource "google_container_node_pool" "primary" {
  name = "primary-pool"
  location = var.cluster_location
  cluster = google_container_cluster.primary.name
  node_count = 2

  node_config {
    disk_size_gb = 75
    disk_type = "pd-standard"
    machine_type = "custom-${var.node_cpus}-${var.node_memory}"

    oauth_scopes = concat(var.node_scopes, [
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/servicecontrol",
      "https://www.googleapis.com/auth/service.management.readonly",
      "https://www.googleapis.com/auth/trace.append"
    ])
  }
}
# Helm release
data "google_client_config" "provider" {}
provider "helm" {
  kubernetes {
    host = "https://${google_container_cluster.primary.endpoint}"
    token = data.google_client_config.provider.access_token
    cluster_ca_certificate = base64decode(
      google_container_cluster.primary.master_auth[0].cluster_ca_certificate,
    )
  }
}
resource "helm_release" "release" {
  name            = var.release_name
  chart           = "${path.module}/swish"
  # timeout         = 600
  recreate_pods   = true
  cleanup_on_fail = true
  atomic          = true
  depends_on      = [
    google_container_node_pool.primary
  ]

  set_sensitive {
    name  = "secretGCP"
    value = base64encode(file("${path.module}/credentials.json"))
  }
  set_sensitive {
    name  = "secretDEVMUXID"
    value = base64encode(var.dev_mux_id)
  }
  set_sensitive {
    name  = "secretDEVMUXSECRET"
    value = base64encode(var.dev_mux_secret)
  }
  set_sensitive {
    name  = "secretPRODMUXID"
    value = base64encode(var.prod_mux_id)
  }
  set_sensitive {
    name  = "secretPRODMUXSECRET"
    value = base64encode(var.prod_mux_secret)
  }
  set_sensitive {
    name  = "secretALGOLIAID"
    value = base64encode(var.algolia_id)
  }
  set_sensitive {
    name  = "secretALGOLIASECRET"
    value = base64encode(var.algolia_secret)
  }
  set_sensitive {
    name  = "secretTLSCRT"
    value = base64encode(var.tls_cert)
  }
  set_sensitive {
    name  = "secretTLSKEY"
    value = base64encode(var.tls_key)
  }
  set {
    name  = "main.dockerTag"
    value = var.main_docker_tag
  }
  set {
    name  = "main.dockerImage"
    value = var.main_docker_image
  }
  set {
    name  = "main.dockerRepo"
    value = var.main_docker_repo
  }
  set {
    name  = "ssr.dockerTag"
    value = var.ssr_docker_tag
  }
  set {
    name  = "ssr.dockerImage"
    value = var.ssr_docker_image
  }
  set {
    name  = "ssr.dockerRepo"
    value = var.ssr_docker_repo
  }
  set {
    name  = "swishRedisAddrProd"
    value = var.prod_redis_address
  }
  set {
    name  = "swishRedisAddrDev"
    value = var.dev_redis_address
  }
  set {
    name  = "gcsStaticIPName"
    value = google_compute_global_address.external_address.name
  }
  set {
    name  = "swishAuthJWKSURI"
    value = var.auth_jwks_uri
  }
  set {
    name  = "swishAuthJWTAudience"
    value = var.auth_jwt_audience
  }
  set {
    name  = "swishAuthJWTIssuer"
    value = var.auth_jwt_issuer
  }
}
