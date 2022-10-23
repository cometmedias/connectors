variable "project" {
  description = "(Required) The ID of the project in which the resource belongs."
  type        = string
}

variable "sendinblue_api_key" {
  description = "(Required) The sendinblue api key"
  type        = string
}

# Parameters environment variables
variable "attributes_abonnements" {
  description = "(Optional) Attributes to synchronize from abonnements table"
  type        = string
}

variable "attributes_type_abonnement" {
  description = "(Optional) Attributes to synchronize from type_abonnement table"
  type        = string
}

variable "attributes_contacts" {
  description = "(Optional) Attributes to synchronize from contacts table"
  type        = string
}

variable "synchronisation_period" {
  description = "(Optional) Period to synchronize"
  type        = string
}

# Intranet environment variables
variable "database_host" {
  description = "(Required) The intranet database host"
  type        = string
}

variable "database_port" {
  description = "(Required) The intranet database port"
  type        = string
}

variable "database_user" {
  description = "(Required) The intranet database user"
  type        = string
}

variable "database_database" {
  description = "(Required) The intranet database database"
  type        = string
}

variable "database_password" {
  description = "(Required) The intranet database password"
  type        = string
}

# Sendinblue environment variables
variable "sendinblue_free_subscription_list_id" {
  description = "(Required) The free subscription list id in sendinblue"
  type        = string
}

variable "sendinblue_premium_subscription_list_id" {
  description = "(Required) The premium subscription list id in sendinblue"
  type        = string
}
