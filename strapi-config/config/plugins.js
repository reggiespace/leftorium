// Copy into the Strapi project's config/plugins.js (or merge with what's
// there). Points Strapi's media library at the Garage S3 bucket instead of
// local disk — required on Dokploy, since the container's disk doesn't
// survive a redeploy and uploaded product photos would otherwise vanish.
//
// Requires: `npm install @strapi/provider-upload-aws-s3` in the Strapi
// project (Garage speaks the S3 API, so the AWS S3 provider works against
// it directly — just point it at Garage's endpoint with path-style
// addressing instead of AWS's).
//
// ASSUMPTION (confirm/correct against your actual Garage setup): bucket
// name is "health" — taken from https://storage.reggiespace.ca/health —
// and this repo's uploads live under a "leftorium/" prefix inside it,
// since a bucket named "health" reads like a shared, multi-project bucket
// rather than one dedicated to this site. Override via S3_BUCKET /
// S3_ROOT_PATH env vars if that's wrong.
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: '@strapi/provider-upload-aws-s3',
      providerOptions: {
        baseUrl: env('S3_BASE_URL', 'https://storage.reggiespace.ca/health'),
        rootPath: env('S3_ROOT_PATH', 'leftorium'),
        s3Options: {
          endpoint: env('S3_ENDPOINT', 'https://storage.reggiespace.ca'),
          // Garage (like most self-hosted S3-compatible stores) expects
          // path-style requests (endpoint/bucket/key), not AWS's default
          // virtual-hosted style (bucket.endpoint/key).
          forcePathStyle: true,
          region: env('S3_REGION', 'garage'),
          credentials: {
            accessKeyId: env('S3_ACCESS_KEY_ID'),
            secretAccessKey: env('S3_SECRET_ACCESS_KEY'),
          },
          params: {
            Bucket: env('S3_BUCKET', 'health'),
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
