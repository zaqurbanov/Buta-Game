/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),

  /*
    |----------------------------------------------------------
    | Variables for configuring database connection
    |----------------------------------------------------------
    */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  ACCESS_TOKEN_SECRET: Env.schema.string(),
  REFRESH_TOKEN_SECRET: Env.schema.string(),
  OTP_TOKEN_SECRET: Env.schema.string(),
  FORGOT_PASSWORD_SECRET: Env.schema.string(),

  ACCESS_TOKEN_EXPIRES_IN: Env.schema.string(),
  REFRESH_TOKEN_EXPIRES_IN: Env.schema.string(),
  OTP_TOKEN_EXPIRES_IN: Env.schema.string(),
  FORGOT_PASSWORD_EXPIRES_IN: Env.schema.string(),

  BREVO_API_KEY: Env.schema.string(),
  BREVO_SENDER_NAME:Env.schema.string(),
  BREVO_SENDER_EMAIL:Env.schema.string(),

  BASE_ROLE:Env.schema.string(),
  BASE_EMAIL:Env.schema.string(),
})
