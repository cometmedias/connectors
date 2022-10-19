provider "google" {
  project = var.project
}

module "sendinblue-update-contacts" {
  source      = "./modules/cloudfunction"
  name        = "sendinblue-update-contacts"
  project     = var.project
  location    = "europe-west1"
  description = "Update contact lists in SendInBlue"
  runtime     = "nodejs16"
  entrypoint  = "sendinblueUpdateContacts"
  source_dir  = "../sendinblue-update-contacts"
  output_path = "../build/sendinblue-update-contacts"
  excludes    = ["node_modules"]

  environment_variables = {
    FREE_SUBSCRIPTION_LIST_ID    = var.free_subscription_list_id
    PREMIUM_SUBSCRIPTION_LIST_ID = var.premium_subscription_list_id
    DATABASE_HOST                = var.database_host
    DATABASE_PORT                = var.database_port
    DATABASE_USER                = var.database_user
    DATABASE_PASSWORD            = var.database_database
  }

  secret_environment_variables = {
    SENDINBLUE_API_KEY = var.sendinblue_api_key
    DATABASE_DATABASE  = var.database_password
  }

  depends_on = [google_project_service.project_services]
}
