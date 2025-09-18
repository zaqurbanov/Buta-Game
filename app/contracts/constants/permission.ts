import { Permissions } from '#contracts/permission/I_permission'
import { RawPermissionItem } from '#contracts/types/auth_types'

export const PERMISSION: RawPermissionItem[] = [
  {
    name: 'contact',
    title: 'Kontakt',
    groupTitle: 'Admin Panel',
    permissionTypes: [Permissions.read, Permissions.create, Permissions.update, Permissions.remove],
  },

  //   {
  //   name: 'seller',
  //   title: 'Satıcılar',
  //   groupTitle: 'Admin Panel',
  //   permissionTypes: [Permissions.read, Permissions.create, Permissions.update, Permissions.remove],
  // },
]
