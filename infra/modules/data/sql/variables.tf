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
variable "instance_network" {
  description = "VPC network ID for the instance"
  type        = string
}
variable "instance_size" {
  description = "Instance size in GB"
  type        = number
}
