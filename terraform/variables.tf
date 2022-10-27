variable "project" {
  description = "(Required) The ID of the project in which the resource belongs."
  type        = string
}

variable "region" {
  type        = string
  description = "Project region"
  default     = "europe-west1"
}

variable "availability_zone" {
  type        = string
  description = "Project availability zone"
  default     = "europe-west1-b"
}

variable "sendinblue_update_contacts_environment_variables" {
  description = "(Optional) Environment variables for sendinblue-update-contacts module"
  type        = map(string)
}

variable "sendinblue_update_contacts_secret_environment_variables" {
  description = "(Optional) Secret environment variables for sendinblue-update-contacts module"
  type        = map(string)
}

variable "directus_environment_variables" {
  description = "(Optional) Environment variables for directus module"
  type        = map(string)
}

variable "directus_secret_environment_variables" {
  description = "(Optional) Secret environment variables for directus module"
  type        = map(string)
}
