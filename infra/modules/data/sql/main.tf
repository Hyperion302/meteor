resource "random_id" "db_name_suffix" {
  byte_length = 4
}
resource "google_sql_database_instance" "master" {
  name             = "${var.instance_name_prefix}-${random_id.db_name_suffix.hex}"
  region           = var.instance_region
  database_version = "MYSQL_5_7"

  settings {
    tier = var.instance_tier
    ip_configuration {
      require_ssl = true
    }
  }
}
