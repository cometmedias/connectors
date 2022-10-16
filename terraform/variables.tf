variable "project" {
  description = "(Required) The ID of the project in which the resource belongs."
  type        = string
}

variable "free_subscription_list_id" {
  description = "(Required) The free subscription list id in sendinblue"
  type        = string
}

variable "premium_subscription_list_id" {
  description = "(Required) The premium subscription list id in sendinblue"
  type        = string
}

variable "sendinblue_api_key" {
  description = "(Required) The sendinblue api key"
  type        = string
}
