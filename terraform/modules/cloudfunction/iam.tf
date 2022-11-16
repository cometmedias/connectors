resource "google_service_account" "main" {
  account_id   = "sa-${var.name}"
  display_name = "Service Account for ${var.name}"
}

resource "google_cloud_run_service_iam_member" "main" {
  count = var.allow_unauthenticated ? 1 : 0

  project  = google_cloudfunctions2_function.main.project
  location = google_cloudfunctions2_function.main.location
  service  = google_cloudfunctions2_function.main.name

  role   = "roles/run.invoker"
  member = "allUsers"
}
