# Connectors

Custom connectors for cometmedias

# Deployment

```shell
tf workspace select dev
tf apply -var-file=tfvars/dev.tfvars

tf workspace select prod
tf apply -var-file=tfvars/prod.tfvars
```

# Trigger function

| env  | url                                                        |
|------|------------------------------------------------------------|
| dev  | https://sendinblue-update-contacts-nmezte2ewa-ew.a.run.app |
| prod | https://sendinblue-update-contacts-fzn2l5go4q-ew.a.run.app |
