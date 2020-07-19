# Bucket
resource "google_storage_bucket" "data_bucket" {
  name     = var.cdn_bucket_name
  location = "US"
}
