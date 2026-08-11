// Merge this into the Strapi project's config/middlewares.js. Strapi's
// default Content-Security-Policy only allows images from 'self' plus a
// couple of Strapi-owned domains — without this, uploads to Garage work
// fine but the admin panel's media library just shows broken image icons.
module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'storage.reggiespace.ca'],
          'media-src': ["'self'", 'data:', 'blob:', 'storage.reggiespace.ca'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
