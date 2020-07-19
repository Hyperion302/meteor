variable "redis_instance_name" {
  description = "Name of the watchtime redis instance"
  type        = string
}

variable "redis_instance_size" {
  description = "Size in GB of the instance"
  type        = number
}

variable "redis_instance_network" {
  description = "ID of the instance's authorized VPC"
  type        = string
}

variable "redis_instance_region_zone" {
  description = "Region + Zone descriptor for the instance"
  default     = "us-central1-a"
  type        = string
}
