variable "name" {
  description = "(Required) A user-defined name of the function. Function names must be unique globally and match pattern projects/*/locations/*/functions/*."
  type        = string
}

variable "project" {
  description = "(Required) The ID of the project in which the resource belongs."
  type        = string
}

variable "location" {
  description = "(Required) The location of this cloud function."
  type        = string
}

variable "description" {
  description = "(Optional) User-provided description of a function."
  type        = string
  default     = ""
}

variable "runtime" {
  description = "(Optional) The runtime in which to run the function. Required when deploying a new function, optional when updating an existing function."
  type        = string
  default     = "nodejs16"
}

variable "entrypoint" {
  description = "(Optional) The name of the function (as defined in source code) that will be executed. Defaults to the resource name suffix, if not specified. For backward compatibility, if function with given name is not found, then the system will try to use function named \"function\". For Node.js this is name of a function exported by the module specified in source_location."
  type        = string
}

variable "source_dir" {
  description = "(Required) Package entire contents of this directory into the archive."
  type        = string
}

variable "output_path" {
  description = "(Required) The output of the archive file."
  type        = string
}

variable "excludes" {
  description = "(Optional) Specify files to ignore when reading the source_dir."
  type        = list(string)
}

variable "allow_unauthenticated" {
  description = "(Optional) Should allow unauthenticated access"
  type        = bool
  default     = true
}
