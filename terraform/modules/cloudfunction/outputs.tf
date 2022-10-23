output "function_uri" {
  value = google_cloudfunctions2_function.main.service_config[0].uri
}

output "service_account" {
  value = google_cloudfunctions2_function.main.service_config[0].service_account_email
}
