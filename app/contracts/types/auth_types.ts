import {Permissions} from "#contracts/permission/I_permission";

export type AuthTokens = {
  accessToken:string,
  refreshToken:string
}

export type RawPermissionItem = {
  groupTitle: string
  name: string
  permissionTypes: Permissions[]
  title: string
}
