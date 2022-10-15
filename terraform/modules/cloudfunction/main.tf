resource "random_string" "main" {
  length  = 5
  special = false
}

data "archive_file" "main" {
  type        = "zip"
  source_dir  = var.source_dir
  output_path = "${var.output_path}.zip"
  excludes    = var.excludes
}

resource "google_storage_bucket" "main" {
  name                        = "${var.project}-${var.name}"
  location                    = var.location
  uniform_bucket_level_access = true
}

resource "google_storage_bucket_object" "main" {
  name   = "${var.name}.zip"
  bucket = google_storage_bucket.main.name
  source = data.archive_file.main.output_path
}

resource "google_cloudfunctions2_function" "main" {
  name        = var.name
  location    = var.location
  description = var.description
  project     = var.project

  build_config {
    runtime     = var.runtime
    entry_point = var.entrypoint

    source {
      storage_source {
        bucket = google_storage_bucket.main.name
        object = google_storage_bucket_object.main.name
      }
    }
  }

  service_config {
    max_instance_count = 1
    available_memory   = "256M"
    timeout_seconds    = 60
  }
}

resource "google_cloud_run_service_iam_member" "main" {
  count = var.allow_unauthenticated ? 1 : 0

  project  = google_cloudfunctions2_function.main.project
  location = google_cloudfunctions2_function.main.location
  service  = google_cloudfunctions2_function.main.name

  role   = "roles/run.invoker"
  member = "allUsers"
}
