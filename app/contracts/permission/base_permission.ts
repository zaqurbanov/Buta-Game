import {Exception} from "@adonisjs/core/exceptions";
import {Permissions} from "#contracts/permission/I_permission";

export default class BasePermission {
  protected defaultPermissions: { [key: string]: boolean } = {
    'create': false,
    'read': false,
    'update': false,
    'remove': false,
  };
  protected permissions: { [key: string]: boolean } = {}
  protected single?: Permissions | string;
  protected name: string = 'perm';

  constructor(perms? : {
    create?: boolean,
    read?: boolean,
    update?: boolean,
    remove?: boolean,
    single?: Permissions | string
  }) {
    this.permissions = {
      ...this.defaultPermissions,
      'create': perms?.create ?? this.defaultPermissions['create'],
      'read': perms?.read ?? this.defaultPermissions['read'],
      'update': perms?.update ?? this.defaultPermissions['update'],
      'remove': perms?.remove ?? this.defaultPermissions['remove'],
    }
    this.single = perms?.single;
  }

  public getSingle(): string {
    if (!this.single) {
      throw new Exception("Single permission not defined");
    }
    return this.normalizePermission(this.single);
  }

  public getPermissions(): string[] {
    const perms = [];
    for (const permission in this.permissions) {
      if (this.permissions[permission]) {
        perms.push(this.normalizePermission(permission));
      }
    }
    return perms;
  }

  normalizePermission(perm: any) {
    return `${this.name}_${perm}`;
  }
}
