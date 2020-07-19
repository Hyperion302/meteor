Major TF resources

- GCP
  - GKE - Main app
  - GCS - Video + icon storage
  - Redis - Watchtime store
  - PubSub - Event pipelines
  - Functions - Event handlers
- Auth0 - Authentication

Things that cannot be made into TF resources

- Algolia
- Mux
- Stripe

Environments

- Production
  - Accessible via main domain
  - Includes production app builds
  - Modifies production data
  - Charges users real money
- Development
  - Accessible via developer domain (?TODO)
  - Modifies development data
  - Uses Stripe test keys

# https://blog.gruntwork.io/how-to-create-reusable-infrastructure-with-terraform-modules-25526d65f73d
