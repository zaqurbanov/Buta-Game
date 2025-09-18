import env from "#start/env";

export const baseRole = {
  name: env.get('BASE_ROLE'),
  active: true,
}

export const baseUser = {
  email: env.get('BASE_EMAIL'),
  active: true,
  isVerified:true,
  password: 'fgI_39.qgs%G&yDK',
}
