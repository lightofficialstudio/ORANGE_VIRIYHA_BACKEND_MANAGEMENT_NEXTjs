/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')([
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
  '@fullcalendar/list',
  '@fullcalendar/timeline'
]);

const nextConfig = withTM({
  reactStrictMode: true,
  images: {
    domains: ['flagcdn.com', 'localhost', 'viriyah.blob.core.windows.net'], // เพิ่ม 'localhost' เข้าไปในรายการ domains
  },

  env: {
    REACT_APP_VERSION: process.env.BACKEND_VIRIYHA_APP_API_URL,
    REACT_APP_API_URL: process.env.BACKEND_VIRIYHA_APP_API_URL,
    BACKEND_VIRIYHA_APP_API_URL: process.env.BACKEND_VIRIYHA_APP_API_URL,
    IMAGE_VIRIYHA_URL: process.env.IMAGE_VIRIYHA_URL,

    REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
    REACT_APP_FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    REACT_APP_FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    REACT_APP_FIREBASE_STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    REACT_APP_FIREBASE_APP_ID: process.env.REACT_APP_FIREBASE_APP_ID,
    REACT_APP_FIREBASE_MEASUREMENT_ID: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,

    REACT_APP_AWS_POOL_ID: process.env.REACT_APP_AWS_POOL_ID,
    REACT_APP_AWS_APP_CLIENT_ID: process.env.REACT_APP_AWS_APP_CLIENT_ID,

    REACT_APP_AUTH0_CLIENT_ID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    REACT_APP_AUTH0_DOMAIN: process.env.REACT_APP_AUTH0_DOMAIN
  }
});

module.exports = nextConfig;
