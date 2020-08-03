variable "instance_name_prefix" {
  description = "Prefix for the instance name"
  type        = string
}
variable "instance_region" {
  description = "Region id for the SQL instance"
  type        = string
}
variable "instance_tier" {
  description = "Compute tier for the instance"
  type        = string
}
variable "application_user" {
  description = "Username for the application user"
  type        = string
}
variable "application_pass" {
  description = "Password for the application user"
  type        = string
}
variable "devops_user" {
  description = "Username for the devops user"
  type        = string
}
variable "databases" {
  description = "Map from internal name to SQL database name"
  type        = map(string)
}
