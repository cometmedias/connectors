provider "google" {
  project = var.project
}

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
  excludes    = ["node_modules"]

  environment_variables = {
    # Parameters
    ATTRIBUTES_ABONNEMENTS     = var.attributes_abonnements
    ATTRIBUTES_TYPE_ABONNEMENT = var.attributes_type_abonnement
    ATTRIBUTES_CONTACTS        = var.attributes_contacts
    SYNCHRONISATION_PERIOD     = var.synchronisation_period

    # Intranet
    DATABASE_HOST     = var.database_host
    DATABASE_PORT     = var.database_port
    DATABASE_USER     = var.database_user
    DATABASE_DATABASE = var.database_database

    # Sendinblue
    SENDINBLUE_FREE_SUBSCRIPTION_LIST_ID    = var.sendinblue_free_subscription_list_id
    SENDINBLUE_PREMIUM_SUBSCRIPTION_LIST_ID = var.sendinblue_premium_subscription_list_id
  }

  secret_environment_variables = {
    DATABASE_PASSWORD  = var.database_password
    SENDINBLUE_API_KEY = var.sendinblue_api_key
  }

  depends_on = [google_project_service.project_services]
}
