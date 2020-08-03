#
# Instances
#
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
#
# Databases
#
resource "google_sql_database" "service_database" {
  for_each = var.databases
  name     = each.value
  instance = google_sql_database_instance.master.name
}
#
# Users
#
resource "google_sql_user" "application" {
  name     = var.application_user
  password = var.application_pass
  instance = google_sql_database_instance.master.name
}
resource "google_sql_user" "devops" {
  name     = var.devops_user
  instance = google_sql_database_instance.master.name
}
