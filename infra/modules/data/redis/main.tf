resource "google_redis_instance" "redis_instance" {
  name               = var.redis_instance_name
  memory_size_gb     = var.redis_instance_size
  authorized_network = var.redis_instance_network
  tier               = "BASIC"
  location_id        = var.redis_instance_region_zone
}
