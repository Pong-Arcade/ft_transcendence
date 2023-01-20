export default () => ({
  fe_host: process.env.FE_HOST,
  port: parseInt(process.env.PORT, 10),
  debug: {
    log: process.env.DEBUG_LOG === 'true' ? true : false,
  },
  ftAuth: {
    clientId: process.env.FT_AUTH_CLIENT_ID,
    secret: process.env.FT_AUTH_SECRET,
    callback: process.env.FT_AUTH_CALLBACK,
  },
});
