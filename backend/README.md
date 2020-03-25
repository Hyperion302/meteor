# Backend

See READMEs in src/services/ for info on the structure of the code and behavior

## Running Locally

All of the mentioned file names for Helm/k8 can be configured during chart installation.

### Out of instance

The Swish backend is run locally by starting node (or ts-node-dev in dev mode) and passing environment variables in using dotenv. Simply run `npm run dev` or `npm run start` to start the application in development or production mode respectively. The application will source it's secrets from the present `.env` (external services) file and `credentials.json` (GCS)

### Helm Chart

When running the helm chart locally (on minikube for example), 3 secrets must be loaded. `external-service-secret` must be loaded with SaaS tokens and IDs. `image-pull-secret` must be loaded with an image pull credential for the Swish backend image. `gcs-secret` must be loaded with a JSON credentials file for an applicable GCS Service Account. The JSON file must be named `key.json`. `tls-secret` must be loaded with a valid tls key for the configured Ingress host.

## Running remotely

Running the Helm Chart remotely on the GKE cluster is simple. GKE should provide a backup service account if the configured account is not properly setup. However, the same aforementioned secrets should all be loaded under the same name.
