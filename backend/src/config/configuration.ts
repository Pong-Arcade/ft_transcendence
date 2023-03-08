export default () => ({
  fe_host: process.env.FE_HOST,
  be_host: process.env.BE_HOST,
  port: parseInt(process.env.PORT, 10),
  debug: {
    log: process.env.DEBUG_LOG === 'true' ? true : false,
  },
  ftAuth: {
    clientId: process.env.FT_AUTH_CLIENT_ID,
    secret: process.env.FT_AUTH_SECRET,
    callback: process.env.FT_AUTH_CALLBACK,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    token: process.env.JWT_TOKEN,
  },
  database: {
    name: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
  email: {
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM,
    tls: {
      maxVersion: process.env.MAIL_TLS_MAXVERSION,
      minVersion: process.env.MAIL_TLS_MINVERSION,
      ciphers: process.env.MAIL_TLS_CIPHERS,
    },
  },
});
