import IHasPermission from "#contracts/permission/i_has_permission";
import BasePermission from "#contracts/permission/base_permission";

export default abstract class BasePermissionService {
  abstract can(user: IHasPermission, permission: BasePermission): boolean

  abstract canAny(user: IHasPermission, permissions: BasePermission[]): boolean

  abstract canAll(user: IHasPermission, permissions: BasePermission[]): boolean
}
