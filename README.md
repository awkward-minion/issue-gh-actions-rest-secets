# Notes

- add `AWS_SECRET_ACCESS_KEY` in github secrets
- create personal access token with repo write scope and store it in `TEST_WRITE_TOKEN`
- run `create-secret.yml` workflow, which will store `DUMMY_AWS_IAM_ROLE_ASSUME` in gh secrets
- add `SAME_SECRET_MANUALLY_ADDED` in gh secrets with same value (same aws role)
- now run test secrets acceissibility by running
    - test_secrets_access.yml (secrets managed from other workflow)
    - test_secrets_manual_access.yml (manually managed secrets )
