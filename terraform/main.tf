module "sendinblue_update_contacts" {
  source      = "./modules/cloudfunction"
  name        = "sendinblue-update-contacts"
  project     = var.project
  location    = "europe-west1"
  description = "Update contact lists in SendInBlue"
  runtime     = "nodejs16"
  entrypoint  = "sendinblueUpdateContacts"
  source_dir  = "../sendinblue-update-contacts"
  output_path = "../build/sendinblue-update-contacts"
  excludes    = ["node_modules", ".env"]

  environment_variables        = var.sendinblue_update_contacts_environment_variables
  secret_environment_variables = var.sendinblue_update_contacts_secret_environment_variables

  depends_on = [google_project_service.project_services]
}

module "directus" {
  source      = "./modules/cloudfunction"
  name        = "directus"
  project     = var.project
  location    = "europe-west1"
  description = "Directus"
  runtime     = "nodejs16"
  entrypoint  = "entrypoint"
  source_dir  = "../directus"
  output_path = "../build/directus"
  excludes    = ["node_modules", ".env"]

  environment_variables        = var.directus_environment_variables
  secret_environment_variables = var.directus_secret_environment_variables

  depends_on = [google_project_service.project_services]
}

resource "null_resource" "directus_update_concurrency" {
  provisioner "local-exec" {
    command = <<-EOT
        gcloud run services update --project ${var.project} --region ${var.region} --cpu 1 ${module.directus.name}
        gcloud run services update --project ${var.project} --region ${var.region} --concurrency 80 ${module.directus.name}
      EOT
  }
}
